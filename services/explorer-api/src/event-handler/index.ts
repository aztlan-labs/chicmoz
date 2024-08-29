import { AZTEC_MESSAGES } from "@chicmoz-pkg/message-registry";
import { onBlock } from "./on-block.js";

export const blockHandler = {
  cb: onBlock as (arg0: unknown) => Promise<void>,
  topicBase: "NEW_BLOCK_EVENT" as keyof AZTEC_MESSAGES,
};
