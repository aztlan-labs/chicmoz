import {
  AZTEC_MESSAGES,
  ETHEREUM_MESSAGES,
  NewBlockEvent,
  PendingTxsEvent,
} from "@chicmoz-pkg/message-registry";
import { onAztecConnectionEvent } from "./on-aztec-connection-event.js";
import { onBlock } from "./on-block/index.js";
import { onL1L2Validator } from "./on-l1-l2-validator.js";
import { onPendingTxs } from "./on-pending-txs.js";
import { logger } from "../../logger.js";
import { ETHEREUM_CHAIN_NAME, ETHEREUM_NETWORK_ID } from "../../constants.js";
import { startSubscribe } from "../../svcs/message-bus/index.js";

export type EventHandler = {
  consumerGroup: string;
  cb: (event: unknown) => Promise<void>;
  topicNetworkId?: string;
  topicBase: keyof AZTEC_MESSAGES | keyof ETHEREUM_MESSAGES;
};

export const blockHandler: EventHandler = {
  consumerGroup: "block",
  cb: onBlock as (arg0: unknown) => Promise<void>,
  topicBase: "NEW_BLOCK_EVENT",
};

export const catchupHandler: EventHandler = {
  // NOTE: this could be a separate handler when needed
  consumerGroup: "blockCatchup",
  cb: ((event: NewBlockEvent) => {
    logger.info(`Catchup block event`);
    return onBlock(event);
  }) as (arg0: unknown) => Promise<void>,
  topicBase: "CATCHUP_BLOCK_EVENT",
};

export const pendingTxHandler: EventHandler = {
  consumerGroup: "pendingTx",
  cb: ((event: PendingTxsEvent) => {
    return onPendingTxs(event);
  }) as (arg0: unknown) => Promise<void>,
  topicBase: "PENDING_TXS_EVENT",
};

export const connectedToAztecHandler: EventHandler = {
  consumerGroup: "connectedToAztec",
  cb: onAztecConnectionEvent as (arg0: unknown) => Promise<void>,
  topicBase: "CONNECTED_TO_AZTEC_EVENT",
};

export const l1L2ValidatorHandler: EventHandler = {
  consumerGroup: "l1l2Validator",
  cb: onL1L2Validator as (arg0: unknown) => Promise<void>,
  topicNetworkId: `${ETHEREUM_CHAIN_NAME}_${ETHEREUM_NETWORK_ID}`,
  topicBase: "L1_L2_VALIDATOR_EVENT",
};

export const subscribeHandlers = async () => {
  await startSubscribe(blockHandler);
  await startSubscribe(catchupHandler);
  await startSubscribe(pendingTxHandler);
  await startSubscribe(connectedToAztecHandler);
  await startSubscribe(l1L2ValidatorHandler);
};
