import { logger } from "../logger.js";
import { Block } from "../types.js";

// eslint-disable-next-line @typescript-eslint/require-await
export const onBlock = async (block: Block) => {
  logger.info(`Received block ${JSON.stringify(block, null, 2)}`);
};
