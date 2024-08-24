import { fromNodeProviderChain } from "@aws-sdk/credential-providers";
import { Logger } from "@chicmoz-pkg/logger-server";
import { MBOptions, MessageBus } from "@chicmoz-pkg/message-bus";
import { generateAuthTokenFromCredentialsProvider } from "aws-msk-iam-sasl-signer-js";
import { Sequelize } from "sequelize";
import {
  AZTEC_RPC,
  CHAIN_NAME,
  KAFKA_CONNECTION,
  KAFKA_MSK_REGION,
  KAFKA_SASL_PASSWORD,
  KAFKA_SASL_USERNAME,
  NETWORK_NAME,
  NODE_ENV,
  POSTGRES_ADMIN,
  POSTGRES_DB_NAME,
  POSTGRES_IP,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  SERVICE_NAME,
} from "./constants.js";
import { Core } from "./core.js";
import { DB } from "./db.js";
import { AztecNetworkClient } from "./aztec-network-client.js";

const logger = new Logger(SERVICE_NAME);

const networkId = `${CHAIN_NAME}_${NETWORK_NAME}`;

const shutdown = (deps: { mb: MessageBus; core: Core; db: DB }) => async (): Promise<void> => {
  logger.info(`Stopping server...`);
  await deps.db.sequelize.close();
  await deps.mb.disconnect();

  logger.info(`Stopping core...`);
  deps.core.stop();
};

const startup = async () => {
  logger.info(`Starting network client... (${AZTEC_RPC})`);

  // FIXME: replace with aztec client
  const networkClient = new AztecNetworkClient(AZTEC_RPC);

  logger.info(`Connecting to kafka... (${KAFKA_CONNECTION})`);

  const mbConfig = { logger, clientId: SERVICE_NAME, connection: KAFKA_CONNECTION } as MBOptions;
  if (KAFKA_MSK_REGION !== "local" && NODE_ENV === "production") {
    const tokenProvider = async (region: string) => {
      const authTokenResponse = await generateAuthTokenFromCredentialsProvider({ region, awsCredentialsProvider: fromNodeProviderChain() });
      return { value: authTokenResponse.token };
    };
    mbConfig.saslConfig = {
      mechanism: "oauthbearer",
      oauthBearerProvider: () => tokenProvider(KAFKA_MSK_REGION),
    };
    mbConfig.ssl = true;
  } else {
    mbConfig.saslConfig = {
      mechanism: "plain",
      username: KAFKA_SASL_USERNAME,
      password: KAFKA_SASL_PASSWORD,
    };
  }

  const mb = new MessageBus(mbConfig);

  logger.info(`Initializing db`);
  const sequelize = new Sequelize(POSTGRES_DB_NAME, POSTGRES_ADMIN, POSTGRES_PASSWORD, {
    dialect: "postgres",
    host: POSTGRES_IP,
    port: POSTGRES_PORT,
    logging: (sql: string) => {
      logger.info(`SQL: ${sql}`);
    },
  });

  await sequelize.authenticate();
  const db = new DB({ sequelize, logger, networkId });

  await db.sync();

  logger.info(`Initializing core...`);
  const core = new Core({ mb, networkClient, logger, db, networkId });

  const latestHeightPublished = await db.getHeight();

  logger.info(`Starting core... (using latest height: ${latestHeightPublished?.height})`);
  if (!latestHeightPublished) await core.start();
  else await core.start(latestHeightPublished.height);

  process.on("unhandledRejection", (err) => {
    logger.error(`unhandledRejection:`, err);
    throw err;
  });

  process.on("uncaughtException", (err) => {
    logger.error(`uncaughtException:`, err);
    throw err;
  });

  process.on("SIGTERM", shutdown({ mb, core, db }));
  process.on("SIGINT", shutdown({ mb, core, db }));

  logger.info(`Service started 🥳`);
};

await startup();
