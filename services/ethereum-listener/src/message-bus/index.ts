import { MBOptions, MessageBus } from "@chicmoz-pkg/message-bus";
import {
  L1Payload,
  L1_MESSAGES,
  generateL1TopicName,
} from "@chicmoz-pkg/message-registry";
import { getL1NetworkId } from "@chicmoz-pkg/types";
import { backOff } from "exponential-backoff";
import {
  KAFKA_CONNECTION,
  KAFKA_SASL_PASSWORD,
  KAFKA_SASL_USERNAME,
  L2_NETWORK_ID,
  SERVICE_NAME,
} from "../environment.js";
import { EventHandler } from "../events/index.js";
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

export const publishMessage = async (
  eventType: keyof L1_MESSAGES,
  message: L1Payload
) => {
  if (!isInitialized) throw new Error("MessageBus is not initialized");
  if (isShutdown) throw new Error("MessageBus is already shutdown");

  const topic = generateL1TopicName(
    L2_NETWORK_ID,
    getL1NetworkId(L2_NETWORK_ID),
    eventType
  );
  await mb.publish(topic, message);
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
