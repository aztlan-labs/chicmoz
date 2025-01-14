import { Logger } from "@chicmoz-pkg/logger-server";
import { type MicroserviceBaseSvc } from "@chicmoz-pkg/microservice-base";
import { MessageBus } from "./class.js";
import {
  KAFKA_CONNECTION,
  KAFKA_SASL_PASSWORD,
  KAFKA_SASL_USERNAME,
  getConfigStr,
} from "./environment.js";

let mb: MessageBus;
let isInitialized = false;
let isShutdown = false;

// eslint-disable-next-line @typescript-eslint/require-await
export const init = async (instanceName: string, logger: Logger) => {
  mb = new MessageBus({
    logger,
    clientId: instanceName,
    connection: KAFKA_CONNECTION,
    saslConfig: {
      mechanism: "plain",
      username: KAFKA_SASL_USERNAME,
      password: KAFKA_SASL_PASSWORD,
    },
  });
  isInitialized = true;
};

export const publishMessage = async <T>(topic: string, message: T) => {
  if (!isInitialized) throw new Error("MessageBus is not initialized");
  if (isShutdown) throw new Error("MessageBus is already shutdown");
  await mb.publish<T>(topic, message);
};

export const startSubscribe = async (
  groupId: string,
  topic: string,
  cb: (message: unknown) => Promise<void>
) => {
  if (!isInitialized) throw new Error("MessageBus is not initialized");
  if (isShutdown) throw new Error("MessageBus is already shutdown");
  await mb.subscribe(groupId, topic, cb);
  await mb.runConsumer(groupId);
}

export const generateSvc: (
  instanceName: string,
  logger: Logger
) => MicroserviceBaseSvc = (instanceName, logger) => ({
  serviceId: "MB",
  init: () => init(instanceName, logger),
  getConfigStr,
  health: () => isInitialized && !isShutdown,
  shutdown: async () => {
    isShutdown = true;
    await mb.disconnect();
  },
});
