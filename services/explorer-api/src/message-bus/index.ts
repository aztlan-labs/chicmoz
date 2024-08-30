import { fromNodeProviderChain } from "@aws-sdk/credential-providers";
import { MBOptions, MessageBus } from "@chicmoz-pkg/message-bus";
import {
  AZTEC_MESSAGES,
  generateAztecTopicName,
} from "@chicmoz-pkg/message-registry";
import { generateAuthTokenFromCredentialsProvider } from "aws-msk-iam-sasl-signer-js";
import { backOff } from "exponential-backoff";
import { SERVICE_NAME } from "../constants.js";
import {
  KAFKA_CONNECTION_URL,
  KAFKA_MSK_REGION,
  KAFKA_SASL_PASSWORD,
  KAFKA_SASL_USERNAME,
  NETWORK_ID,
  NODE_ENV,
} from "../environment.js";
import { logger } from "../logger.js";

let mb: MessageBus;

// eslint-disable-next-line @typescript-eslint/require-await
export const init = async () => {
  logger.info(`Initializing Kafka client...`);
  const mbConfig = {
    logger,
    clientId: SERVICE_NAME,
    connection: KAFKA_CONNECTION_URL,
  } as MBOptions;
  if (KAFKA_MSK_REGION !== "local" && NODE_ENV === "production") {
    // TODO: this might be removed if we are not using managed Kafka
    const tokenProvider = async (region: string) => {
      const authTokenResponse = await generateAuthTokenFromCredentialsProvider({
        region,
        awsCredentialsProvider: fromNodeProviderChain(),
      });
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

  const gracefulShutdown = async () => {
    logger.info(`Shutting down Kafka client...`);
    await mb.disconnect();
  };

  mb = new MessageBus(mbConfig);

  // TODO: find out and log if message-bus is not empty (or at least if there are a lot of messages)

  return {
    shutdownMb: gracefulShutdown,
  };
};

const tryStartSubscribe = async (
  cb: (arg0: unknown) => Promise<void>,
  topic: string
) => {
  await mb.subscribe(SERVICE_NAME, topic, cb);
  await mb.runConsumer(SERVICE_NAME);
};

export const startSubscribe = async ({
  cb,
  topicBase,
}: {
  cb: (arg0: unknown) => Promise<void>;
  topicBase: keyof AZTEC_MESSAGES;
}) => {
  if (!mb) throw new Error("Message bus not initialized");

  const tryIt = async () =>
    tryStartSubscribe(cb, generateAztecTopicName(NETWORK_ID, topicBase));

  await backOff(tryIt, {
    maxDelay: 10000,
    retry: (e, attemptNumber: number) => {
      // TODO: probably not infinite retries?
      logger.warn(e);
      logger.info(`Retrying attempt ${attemptNumber}...`);
      return true;
    },
  });
};
