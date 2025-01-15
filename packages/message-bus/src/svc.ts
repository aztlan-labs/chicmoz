import { Logger } from "@chicmoz-pkg/logger-server";
import {
  type ChicmozMessageBusPayload,
  type ChicmozMessageBusTopic,
} from "@chicmoz-pkg/message-registry";
import {
  MicroserviceBaseSvcState,
  getSvcState,
  type MicroserviceBaseSvc,
} from "@chicmoz-pkg/microservice-base";
import { MessageBus } from "./class.js";
import {
  KAFKA_CONNECTION,
  KAFKA_SASL_PASSWORD,
  KAFKA_SASL_USERNAME,
  getConfigStr,
} from "./environment.js";

let mb: MessageBus;
const serviceId = "MB";

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
};

const checkReady = () => {
  const state = getSvcState(serviceId);
  if (state === MicroserviceBaseSvcState.SHUTTING_DOWN)
    throw new Error("MessageBus is shutting down");
  if (state === MicroserviceBaseSvcState.DOWN)
    throw new Error("MessageBus is down");
  if (state === MicroserviceBaseSvcState.INITIALIZING)
    throw new Error("MessageBus is initializing");
  return state;
};

export const publishMessage = async (
  topic: ChicmozMessageBusTopic,
  payload: ChicmozMessageBusPayload
) => {
  checkReady();
  await mb.publish<ChicmozMessageBusPayload>(topic, payload);
};

export const startSubscribe = async (
  groupId: string,
  topic: ChicmozMessageBusTopic,
  cb: (message: ChicmozMessageBusPayload) => Promise<void>
) => {
  checkReady();
  await mb.subscribe(groupId, topic, cb);
  await mb.runConsumer(groupId);
};

export const generateSvc: (
  instanceName: string,
  logger: Logger
) => MicroserviceBaseSvc = (instanceName, logger) => ({
  serviceId,
  init: () => init(instanceName, logger),
  getConfigStr,
  health: () => getSvcState(serviceId) === MicroserviceBaseSvcState.UP,
  shutdown: async () => {
    await mb.disconnect();
  },
});
