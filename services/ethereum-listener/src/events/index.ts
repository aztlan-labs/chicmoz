import {
  AZTEC_MESSAGES,
  ConnectedToAztecEvent,
  generateAztecTopicName,
} from "@chicmoz-pkg/message-registry";
import { ChicmozL1L2Validator } from "@chicmoz-pkg/types";
import { AZTEC_NETWORK_ID, SERVICE_NAME } from "../environment.js";
import { logger } from "../logger.js";
import { startPolling } from "../network-client/index.js";
import { publishMessage } from "../message-bus/index.js";

const emitL1Validator = async (validator: ChicmozL1L2Validator) => {
  const objToSend = {
    ...validator,
    stake: validator.stake.toString(),
  };
  await publishMessage("L1_L2_VALIDATOR_EVENT", { validator: objToSend });
};

const onAztecConnectionEvent = async (event: ConnectedToAztecEvent) => {
  logger.info(`🔗 Aztec connection event ${JSON.stringify(event)}`);
  // TODO: start polling based on stored info from DB and connection to RPC (don't wait for Aztec connection event)
  await startPolling(event.nodeInfo.l1ContractAddresses);
};

const connectedToAztecHandler: EventHandler = {
  consumerGroup: SERVICE_NAME,
  cb: onAztecConnectionEvent as (arg0: unknown) => Promise<void>,
  topic: generateAztecTopicName(
    AZTEC_NETWORK_ID,
    "CONNECTED_TO_AZTEC_EVENT"
  ) as AztecTopic,
};

type AztecTopic = `${typeof AZTEC_NETWORK_ID}_${keyof AZTEC_MESSAGES}`;

export type EventHandler = {
  consumerGroup: string;
  cb: (event: unknown) => Promise<void>;
  topic: AztecTopic;
};

export const emit = {
  l1Validator: emitL1Validator,
};
export const handlers = {
  connectedToAztec: connectedToAztecHandler,
};
