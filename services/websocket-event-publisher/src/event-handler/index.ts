import { AZTEC_MESSAGES } from "@chicmoz-pkg/message-registry";
import { onBlock } from "./on-block.js";

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
