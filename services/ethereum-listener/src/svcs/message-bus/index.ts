import {
  EventHandler,
  generateSvc,
  publishMessage as pub,
  startSubscribe as sub,
} from "@chicmoz-pkg/message-bus";
import {
  L1_MESSAGES,
  generateL1TopicName,
  type ChicmozMessageBusPayload,
} from "@chicmoz-pkg/message-registry";
import {
  INSTANCE_NAME,
  type MicroserviceBaseSvc,
} from "@chicmoz-pkg/microservice-base";
import { getL1NetworkId } from "@chicmoz-pkg/types";
import { L2_NETWORK_ID } from "../../environment.js";
import { logger } from "../../logger.js";

const l1NetworkId = getL1NetworkId(L2_NETWORK_ID);

export const publishMessage = async (
  eventType: keyof L1_MESSAGES,
  message: ChicmozMessageBusPayload
) => {
  const topic = generateL1TopicName(L2_NETWORK_ID, l1NetworkId, eventType);
  logger.info(`Publishing message to topic ${topic}`);
  await pub(topic, message);
};

export const publishMessageSync = (
  ...args: Parameters<typeof publishMessage>
) => {
  publishMessage(...args).catch((e) => logger.error((e as Error).message));
};

export const startSubscribe = async (eventHandler: EventHandler) => {
  await sub(eventHandler, logger);
};

export const messageBusService: MicroserviceBaseSvc = generateSvc(
  INSTANCE_NAME,
  logger
);
