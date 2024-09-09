import { L2Block } from "@aztec/aztec.js";
import { controllers } from "../database/index.js";
import { logger } from "../logger.js";

export const onBlock = async ({ block }: { block: string }) => {
  const b = L2Block.fromString(block);
  try {
    logger.info(`🧢🧢🧢🧢🧢🧢🧢🧢🧢Storing block ${b.number}`);
    await controllers.block.store(b);
  } catch (e) {
    logger.error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Failed to store block ${b.number}: ${(e as Error)?.stack ?? e}`
    );
  }
};
