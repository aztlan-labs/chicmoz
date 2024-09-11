import { MBOptions, MessageBus } from "@chicmoz-pkg/message-bus";
import {
  KAFKA_CONNECTION,
  KAFKA_SASL_PASSWORD,
  KAFKA_SASL_USERNAME,
  NETWORK_ID,
  SERVICE_NAME,
} from "../constants.js";
import { logger } from "../logger.js";
import {AZTEC_MESSAGES, generateAztecTopicName} from "@chicmoz-pkg/message-registry";

let mb: MessageBus;

// eslint-disable-next-line @typescript-eslint/require-await
export const init = async () => {
  logger.info(`Initializing Kafka client...`);

  const mbConfig = {
    logger,
    clientId: SERVICE_NAME,
    connection: KAFKA_CONNECTION,
    saslConfig: {
      mechanism: "plain",
      username: KAFKA_SASL_USERNAME,
      password: KAFKA_SASL_PASSWORD,
    },
  } as MBOptions;

  const gracefulShutdown = async () => {
    logger.info(`Shutting down Kafka client...`);
    await mb.disconnect();
  };

  mb = new MessageBus(mbConfig);

  return {
    shutdownMb: gracefulShutdown,
  };
};

export const publishMessage = async <T>(eventType: keyof AZTEC_MESSAGES, message: T) => {
  const topic = generateAztecTopicName(NETWORK_ID, eventType);
  if (!mb) throw new Error("MessageBus is not initialized");
  await mb.publish<T>(topic, message);
};
