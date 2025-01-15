import { generateSvc, startSubscribe as sub } from "@chicmoz-pkg/message-bus";
import { generateTopicName } from "@chicmoz-pkg/message-registry";
import {
  INSTANCE_NAME,
  type MicroserviceBaseSvc,
} from "@chicmoz-pkg/microservice-base";
import { backOff } from "exponential-backoff";
import { NETWORK_ID } from "../../environment.js";
import { EventHandler } from "../../events/received/index.js";
import { logger } from "../../logger.js";

const tryStartSubscribe = async ({
  consumerGroup,
  cb,
  topicNetworkId,
  topicBase,
}: EventHandler) => {
  const topic = generateTopicName(topicNetworkId ?? NETWORK_ID, topicBase);
  const groupId = `${INSTANCE_NAME}-${consumerGroup}`;
  await sub(groupId, topic, cb);
};

export const startSubscribe = async (eventHandler: EventHandler) => {
  const tryIt = async () => await tryStartSubscribe(eventHandler);
  await backOff(tryIt, {
    maxDelay: 10000,
    retry: (e, attemptNumber: number) => {
      if ((e as Error).message === "MessageBus is not initialized") {
        logger.info("Trying to subscribe before MessageBus is initialized...");
        return false;
      }
      // TODO: probably not infinite retries?
      logger.warn(e);
      logger.info(`Retrying attempt ${attemptNumber}...`);
      return true;
    },
  });
};

export const messageBusService: MicroserviceBaseSvc = generateSvc(
  INSTANCE_NAME,
  logger
);
