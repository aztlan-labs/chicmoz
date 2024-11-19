import {
  AZTEC_MESSAGES,
  NewBlockEvent,
  PendingTxsEvent,
} from "@chicmoz-pkg/message-registry";
import { logger } from "../logger.js";
import { onBlock } from "./on-block/index.js";
import { onAztecConnectionEvent } from "./on-aztec-connection-event.js";
import { onPendingTxs } from "./on-pending-txs.js";

export type EventHandler = {
  consumerGroup: string;
  cb: (event: unknown) => Promise<void>;
  topicBase: keyof AZTEC_MESSAGES;
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
