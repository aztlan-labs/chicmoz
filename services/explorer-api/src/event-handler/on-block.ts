import { L2Block } from "@aztec/aztec.js";
import { controllers } from "../database/index.js";
import { logger } from "../logger.js";
import { Block, partialBlockSchema } from "../block-types.js";

export const onBlock = async ({ block }: { block: string }) => {
  const b = L2Block.fromString(block);
  try {
    logger.info(`🧢🧢🧢🧢🧢🧢🧢🧢🧢Storing block ${b.number}`);
    await controllers.block.store(b);
    // just testing
    logger.info("STORED!");
    const latestBlock = await controllers.block.getLatest();
    logger.info(`------- ${JSON.stringify(latestBlock)}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const b2: Partial<Block> = partialBlockSchema.parse(latestBlock);
    logger.info(`+++++++ ${b2?.header?.globalVariables?.blockNumber}`);
  } catch (e) {
    logger.error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      //`Failed to store block ${b.number}: ${(e as Error)?.stack ?? e}`
      e
    );
  }
};
