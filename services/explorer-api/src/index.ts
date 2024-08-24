import { fromNodeProviderChain } from "@aws-sdk/credential-providers";
import { createErrorMiddleware } from "@chicmoz-pkg/error-middleware";
import { Logger } from "@chicmoz-pkg/logger-server";
import { MBOptions, MessageBus } from "@chicmoz-pkg/message-bus";
import { generateAuthTokenFromCredentialsProvider } from "aws-msk-iam-sasl-signer-js";
import bodyParser from "body-parser";
import express from "express";
import http from "http";
import {
  BODY_LIMIT,
  CHAIN_NAME,
  KAFKA_CONNECTION,
  KAFKA_MSK_REGION,
  KAFKA_SASL_PASSWORD,
  KAFKA_SASL_USERNAME,
  NETWORK_NAME,
  NODE_ENV,
  PARAMETER_LIMIT,
  PORT,
  SERVICE_NAME,
} from "./constants.js";
import { Core } from "./core.js";
import { EventHandler } from "./event-handler.js";
import { expressConfig } from "./express-config.js";
import { newRouter } from "./routes/route.js";

const logger = new Logger(SERVICE_NAME);

const networkId = `${CHAIN_NAME}_${NETWORK_NAME}`;

const shutdown = (deps: { server: http.Server; mb: MessageBus }) => async (): Promise<void> => {
  const { server, mb } = deps;

  logger.info(`Stopping server...`);

  server.close((error) => {
    if (error) throw error;
    logger.info("Stopped server");
    process.exit(0);
  });

  logger.info(`Stopping kafka...`);
  await mb.disconnect();
};

const startup = async () => {
  logger.info(`Initializing express...`);

  const app = express();
  expressConfig(app, {
    BODY_LIMIT,
    PARAMETER_LIMIT,
    NODE_ENV,
  });

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

  logger.info(`Initializing Kafka client...`);
  const mb = new MessageBus(mbConfig);

  logger.info(`Starting EventHandler service...`);
  const eventHandler = new EventHandler({ logger: logger });

  logger.info(`Initializing core...`);
  const core = new Core({ logger, mb, networkId, eventHandler });

  logger.info(`Starting core...`);
  await core.start();

  logger.info(`Starting express server...`);
  app.use(newRouter({ logger }));

  // body parser should be configured AFTER proxy configuration https://www.npmjs.com/package/express-http-proxy#middleware-mixing
  app.use(
    bodyParser.json({
      limit: BODY_LIMIT,
    }),
  );
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: BODY_LIMIT,
      parameterLimit: PARAMETER_LIMIT,
    }),
  );

  const errorMiddleware = createErrorMiddleware(logger);
  app.use(errorMiddleware);

  const server = http.createServer(app);

  process.on("unhandledRejection", (err) => {
    logger.error("unhandledRejection:", err);
    throw err;
  });

  process.on("uncaughtException", (err) => {
    logger.error(`uncaughtException ${err.stack}`);
    throw err;
  });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  process.on("SIGTERM", shutdown({ server, mb }));
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  process.on("SIGINT", shutdown({ server, mb }));

  server.listen(PORT, "0.0.0.0", () => {
    logger.info(`Service listening on port ${PORT} [${NODE_ENV} mode]`);
  });
  logger.info(`Service started 🥳`);
};

await startup();
