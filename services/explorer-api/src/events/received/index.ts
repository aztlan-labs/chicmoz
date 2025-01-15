import {
  type ChicmozMessageBusPayload,
  type ChicmozMessageBusTopic,
  type NewBlockEvent,
  type PendingTxsEvent,
  generateL1TopicName,
  generateL2TopicName,
} from "@chicmoz-pkg/message-registry";
import { L1_NETWORK_ID, L2_NETWORK_ID } from "../../environment.js";
import { logger } from "../../logger.js";
import { startSubscribe } from "../../svcs/message-bus/index.js";
import { onAztecConnectionEvent } from "./on-aztec-connection-event.js";
import { onBlock } from "./on-block/index.js";
import { onL1L2Validator } from "./on-l1-l2-validator.js";
import { onPendingTxs } from "./on-pending-txs.js";

export type EventHandler = {
  consumerGroup: string;
  cb: (event: ChicmozMessageBusPayload) => Promise<void>;
  topic: ChicmozMessageBusTopic;
};

export const blockHandler: EventHandler = {
  consumerGroup: "block",
  cb: onBlock as (arg0: unknown) => Promise<void>,
  topic: generateL2TopicName(L2_NETWORK_ID, "NEW_BLOCK_EVENT"),
};

export const catchupHandler: EventHandler = {
  // NOTE: this could be a separate handler when needed
  consumerGroup: "blockCatchup",
  cb: ((event: NewBlockEvent) => {
    logger.info(`Catchup block event`);
    return onBlock(event);
  }) as (arg0: unknown) => Promise<void>,
  topic: generateL2TopicName(L2_NETWORK_ID, "CATCHUP_BLOCK_EVENT"),
};

export const pendingTxHandler: EventHandler = {
  consumerGroup: "pendingTx",
  cb: ((event: PendingTxsEvent) => {
    return onPendingTxs(event);
  }) as (arg0: unknown) => Promise<void>,
  topic: generateL2TopicName(L2_NETWORK_ID, "PENDING_TXS_EVENT"),
};

export const connectedToAztecHandler: EventHandler = {
  consumerGroup: "connectedToAztec",
  cb: onAztecConnectionEvent as (arg0: unknown) => Promise<void>,
  topic: generateL2TopicName(L2_NETWORK_ID, "CONNECTED_TO_L2_EVENT"),
};

export const l1L2ValidatorHandler: EventHandler = {
  consumerGroup: "l1l2Validator",
  cb: onL1L2Validator as (arg0: unknown) => Promise<void>,
  topic: generateL1TopicName(
    L2_NETWORK_ID,
    L1_NETWORK_ID,
    "L1_L2_VALIDATOR_EVENT"
  ),
};

export const subscribeHandlers = async () => {
  await startSubscribe(blockHandler);
  await startSubscribe(catchupHandler);
  await startSubscribe(pendingTxHandler);
  await startSubscribe(connectedToAztecHandler);
  await startSubscribe(l1L2ValidatorHandler);
};
