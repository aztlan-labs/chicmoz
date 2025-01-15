import {
  type ChicmozMessageBusPayload,
  L2_MESSAGES,
  type PendingTxsEvent,
} from "@chicmoz-pkg/message-registry";
import { onBlock } from "./on-block.js";
import { onPendingTxs } from "./on-pending-txs.js";

export type EventHandler = {
  consumerGroup: string;
  cb: (event: ChicmozMessageBusPayload) => Promise<void>;
  topicBase: keyof L2_MESSAGES;
};

export const blockHandler: EventHandler = {
  consumerGroup: "block",
  cb: onBlock as (arg0: unknown) => Promise<void>,
  topicBase: "NEW_BLOCK_EVENT",
};

export const pendingTxHandler: EventHandler = {
  consumerGroup: "pendingTx",
  cb: ((event: PendingTxsEvent) => {
    return onPendingTxs(event);
  }) as (arg0: unknown) => Promise<void>,
  topicBase: "PENDING_TXS_EVENT",
};
