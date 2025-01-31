import {
  EventHandler,
  generateSvc,
  startSubscribe as sub,
} from "@chicmoz-pkg/message-bus";
import {
  INSTANCE_NAME,
  type MicroserviceBaseSvc,
} from "@chicmoz-pkg/microservice-base";
import { logger } from "../../logger.js";

export const startSubscribe = async (eventHandler: EventHandler) => {
  await sub(eventHandler, logger);
};

export const messageBusService: MicroserviceBaseSvc = generateSvc(
  INSTANCE_NAME,
  logger
);
