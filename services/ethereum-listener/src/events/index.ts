import {
  ChicmozChainInfoEvent,
  generateL2TopicName,
  type ChicmozMessageBusTopic,
} from "@chicmoz-pkg/message-registry";
import { ChicmozL1L2Validator } from "@chicmoz-pkg/types";
import { L2_NETWORK_ID, SERVICE_NAME } from "../environment.js";
import { logger } from "../logger.js";
import { publishMessage } from "../message-bus/index.js";
import { startPolling } from "../network-client/index.js";

const emitL1Validator = async (validator: ChicmozL1L2Validator) => {
  const objToSend = {
    ...validator,
    stake: validator.stake.toString(),
  };
  await publishMessage("L1_L2_VALIDATOR_EVENT", { validator: objToSend });
};

export const onChainInfo = async (event: ChicmozChainInfoEvent) => {
  logger.info(`🔗 chain info event ${JSON.stringify(event)}`);
  await startPolling(event.chainInfo.l1ContractAddresses);
};

const connectedToAztecHandler: EventHandler = {
  consumerGroup: SERVICE_NAME,
  cb: onChainInfo as (arg0: unknown) => Promise<void>,
  topic: generateL2TopicName(L2_NETWORK_ID, "CHAIN_INFO_EVENT"),
};

export type EventHandler = {
  consumerGroup: string;
  cb: (event: unknown) => Promise<void>;
  topic: ChicmozMessageBusTopic;
};

export const emit = {
  l1Validator: emitL1Validator,
};
export const handlers = {
  connectedToAztec: connectedToAztecHandler,
};
