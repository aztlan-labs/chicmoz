import { MBOptions, MessageBus } from "@chicmoz-pkg/message-bus";
import {
  AZTEC_MESSAGES,
  generateAztecTopicName,
} from "@chicmoz-pkg/message-registry";
import {
  KAFKA_CONNECTION,
  KAFKA_SASL_PASSWORD,
  KAFKA_SASL_USERNAME,
  NETWORK_ID,
  SERVICE_NAME,
} from "../constants.js";
import { logger } from "../logger.js";

let mb: MessageBus;
let isInitialized = false;
let isShutdown = false;

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
    isShutdown = true;
    await mb.disconnect();
  };

  mb = new MessageBus(mbConfig);
  isInitialized = true;

  return {
    id: "MB",
    shutdownCb: gracefulShutdown,
  };
};

export const publishMessage = async <T>(
  eventType: keyof AZTEC_MESSAGES,
  message: T
) => {
  if (!isInitialized) throw new Error("MessageBus is not initialized");
  if (isShutdown) throw new Error("MessageBus is already shutdown");

  const topic = generateAztecTopicName(NETWORK_ID, eventType);
  logger.info(`Publishing message to topic ${topic}`);
  await mb.publish<T>(topic, message);
};
