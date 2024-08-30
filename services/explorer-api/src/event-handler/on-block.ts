import { L2Block } from "@aztec/aztec.js";
import { blockDB } from "../database/index.js";
import {logger} from "../logger.js";

export const onBlock = async ({ block }: { block: string }) => {
  const b = L2Block.fromString(block);
  try {
    await blockDB.store(b);
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    logger.error(`Failed to store block ${b.number}: ${e}`);
  }
};
