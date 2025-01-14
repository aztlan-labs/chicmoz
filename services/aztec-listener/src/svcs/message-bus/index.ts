import { MBOptions, MessageBus } from "@chicmoz-pkg/message-bus";
import { type MicroserviceBaseSvc } from "@chicmoz-pkg/microservice-base";
import {
  AZTEC_MESSAGES,
  generateAztecTopicName,
} from "@chicmoz-pkg/message-registry";
import {
  KAFKA_CONNECTION,
  KAFKA_SASL_PASSWORD,
  KAFKA_SASL_USERNAME,
  NETWORK_ID,
  INSTANCE_NAME,
} from "../../constants.js";
import { logger } from "../../logger.js";

let mb: MessageBus;
let isInitialized = false;
let isShutdown = false;

const getConfig: () => MBOptions = () => ({
  logger,
  clientId: INSTANCE_NAME,
  connection: KAFKA_CONNECTION,
  saslConfig: {
    mechanism: "plain",
    username: KAFKA_SASL_USERNAME,
    password: KAFKA_SASL_PASSWORD,
  },
});


export const messageBusConfigStr = () => {
  const conf = getConfig();
  return `Kafka initalizing with
clientId: ${conf.clientId}
connection: ${conf.connection}`;
};

// eslint-disable-next-line @typescript-eslint/require-await
export const init = async () => {
  mb = new MessageBus(getConfig());
  isInitialized = true;
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

export const messageBusService: MicroserviceBaseSvc = {
  serviceId: "MB",
  init,
  health: () => isInitialized && !isShutdown,
  shutdown: async () => {
    isShutdown = true;
    await mb.disconnect();
  }
};
