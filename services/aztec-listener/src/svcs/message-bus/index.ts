import { generateSvc, publishMessage as pub } from "@chicmoz-pkg/message-bus";
import {
  AZTEC_MESSAGES,
  generateAztecTopicName,
} from "@chicmoz-pkg/message-registry";
import { type MicroserviceBaseSvc } from "@chicmoz-pkg/microservice-base";
import { INSTANCE_NAME, NETWORK_ID } from "../../constants.js";
import { logger } from "../../logger.js";

export const publishMessage = async <T>(
  eventType: keyof AZTEC_MESSAGES,
  message: T
) => {
  const topic = generateAztecTopicName(NETWORK_ID, eventType);
  logger.info(`Publishing message to topic ${topic}`);
  await pub<T>(topic, message);
};

export const messageBusService: MicroserviceBaseSvc = generateSvc(
  INSTANCE_NAME,
  logger
);
