import { MBOptions, MessageBus } from "@chicmoz-pkg/message-bus";
import { backOff } from "exponential-backoff";
import {
  ETHEREUM_MESSAGES,
  generateEthereumTopicName,
} from "@chicmoz-pkg/message-registry";
import {
  ETHEREUM_NETWORK_ID,
  KAFKA_CONNECTION,
  KAFKA_SASL_PASSWORD,
  KAFKA_SASL_USERNAME,
  SERVICE_NAME,
} from "../environment.js";
import { logger } from "../logger.js";
import { EventHandler } from "../events/index.js";

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
  eventType: keyof ETHEREUM_MESSAGES,
  message: T
) => {
  if (!isInitialized) throw new Error("MessageBus is not initialized");
  if (isShutdown) throw new Error("MessageBus is already shutdown");

  const topic = generateEthereumTopicName(ETHEREUM_NETWORK_ID.toString(), eventType);
  await mb.publish<T>(topic, message);
};

const tryStartSubscribe = async ({
  consumerGroup,
  cb,
  topic,
}: EventHandler) => {
  if (!isInitialized) throw new Error("MessageBus is not initialized");
  if (isShutdown) throw new Error("MessageBus is already shutdown");

  logger.info(`Subscribing to topic ${topic}...`);
  await mb.subscribe(consumerGroup, topic, cb);
  logger.info(`Started consuming from topic ${topic}`);
  await mb.runConsumer(consumerGroup);
  logger.info(`Started consuming from topic ${topic}`);
};

export const startSubscribe = async (eventHandler: EventHandler) => {
  if (!isInitialized) throw new Error("MessageBus is not initialized");
  if (isShutdown) throw new Error("MessageBus is already shutdown");

  const tryIt = async () => await tryStartSubscribe(eventHandler);

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
