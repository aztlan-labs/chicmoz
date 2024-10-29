import {
  AZTEC_MESSAGES,
  ConnectedToAztecEvent,
  generateAztecTopicName,
} from "@chicmoz-pkg/message-registry";
import { logger } from "../logger.js";
import { AZTEC_NETWORK_ID, SERVICE_NAME } from "../environment.js";
import { startPolling } from "../network-client/index.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/require-await
const emitL1Update = async (a: any) => {
  logger.info(`Trying to emit L1 update event ${JSON.stringify(a)}`);
};

const onAztecConnectionEvent = async (event: ConnectedToAztecEvent) => {
  logger.info(`🔗 Aztec connection event ${JSON.stringify(event)}`);
  await startPolling(event.nodeInfo.l1ContractAddresses);
};

const connectedToAztecHandler: EventHandler = {
  consumerGroup: SERVICE_NAME,
  cb: onAztecConnectionEvent as (arg0: unknown) => Promise<void>,
  topic: generateAztecTopicName(AZTEC_NETWORK_ID, "CONNECTED_TO_AZTEC_EVENT") as AztecTopic,
};

type AztecTopic = `${typeof AZTEC_NETWORK_ID}_${keyof AZTEC_MESSAGES}`;

export type EventHandler = {
  consumerGroup: string;
  cb: (event: unknown) => Promise<void>;
  topic: AztecTopic;
};

export const emit = {
  l1Update: emitL1Update,
};
export const handlers = {
  connectedToAztec: connectedToAztecHandler,
};
