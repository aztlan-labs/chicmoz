import { MBOptions, MessageBus } from "@chicmoz-pkg/message-bus";
import { generateAztecTopicName } from "@chicmoz-pkg/message-registry";
import { backOff } from "exponential-backoff";
import { SERVICE_NAME } from "../constants.js";
import {
  KAFKA_CONNECTION_URL,
  KAFKA_SASL_PASSWORD,
  KAFKA_SASL_USERNAME,
  NETWORK_ID,
} from "../environment.js";
import { logger } from "../logger.js";
import { EventHandler } from "../event-handler/index.js";

let mb: MessageBus;

// eslint-disable-next-line @typescript-eslint/require-await
export const init = async () => {
  logger.info(`Initializing Kafka client...`);
  const mbConfig = {
    logger,
    clientId: SERVICE_NAME,
    connection: KAFKA_CONNECTION_URL,
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

const tryStartSubscribe = async (
  { consumerGroup, cb, topicBase }: EventHandler,
  crashCallback: () => void
) => {
  const topic = generateAztecTopicName(NETWORK_ID, topicBase);
  const groupId = `${SERVICE_NAME}-${consumerGroup}`;
  logger.info(`Subscribing to topic ${topic}...`);
  await mb.subscribe(groupId, topic, cb);
  logger.info(`Started consuming from topic ${topic}`);
  await mb.runConsumer(groupId, crashCallback);
  logger.info(`Started consuming from topic ${topic}`);
};

export const startSubscribe = async (
  eventHandler: EventHandler,
  crashCallback: () => void
) => {
  if (!mb) throw new Error("Message bus not initialized");

  const tryIt = async () =>
    await tryStartSubscribe(eventHandler, crashCallback);

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
