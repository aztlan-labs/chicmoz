import { EventHandler } from "@chicmoz-pkg/message-bus";
import {
  ChicmozChainInfoEvent,
  generateL2TopicName,
} from "@chicmoz-pkg/message-registry";
import { ChicmozL1L2Validator } from "@chicmoz-pkg/types";
import { SERVICE_NAME } from "../constants.js";
import { L2_NETWORK_ID } from "../environment.js";
import { logger } from "../logger.js";
import { publishMessage } from "../svcs/message-bus/index.js";
import { onL1ContractAddresses } from "../svcs/network-client/index.js";
import { startPolling } from "../svcs/poller-contract-changes/index.js";

const emitL1Validator = async (validator: ChicmozL1L2Validator) => {
  const objToSend = {
    ...validator,
    stake: validator.stake.toString(),
  };
  await publishMessage("L1_L2_VALIDATOR_EVENT", { validator: objToSend });
};

const groupId = `${SERVICE_NAME}-${L2_NETWORK_ID}`;

export const onChainInfo = async (event: ChicmozChainInfoEvent) => {
  logger.info(`🔗 chain info event ${JSON.stringify(event)}`);
  // TODO: start polling based on stored info from DB and connection to RPC (don't wait for Aztec connection event)
  onL1ContractAddresses(event.chainInfo.l1ContractAddresses);
  await startPolling();
};

const connectedToAztecHandler: EventHandler = {
  groupId,
  cb: onChainInfo as (arg0: unknown) => Promise<void>,
  topic: generateL2TopicName(L2_NETWORK_ID, "CHAIN_INFO_EVENT"),
};

export const emit = {
  l1Validator: emitL1Validator,
};
export const handlers = {
  connectedToAztec: connectedToAztecHandler,
};
