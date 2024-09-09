import { L2Block } from "@aztec/aztec.js";
import { logger } from "../logger.js";
import { controllers } from "../database/index.js";
import { chicmozL2BlockSchema, type ChicmozL2Block } from "@chicmoz-pkg/types";

export const onBlock = async ({ block }: { block: string }) => {
  const b = L2Block.fromString(block);
  let parsedBlock: ChicmozL2Block;
  try {
    logger.info(`👓 Parsing block ${b.number}`);
    parsedBlock = chicmozL2BlockSchema.parse({
      hash: b.hash().toString(),
      ...JSON.parse(JSON.stringify(b)),
    });
  } catch (e) {
    logger.error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Failed to parse block ${b.number}: ${e}`
    );
    return;
  }
  try {
    logger.info(`🧢 Storing block ${b.number} (hash: ${parsedBlock.hash})`);
    // logger.info(JSON.stringify(parsedBlock));
    await controllers.l2Block.store(parsedBlock);
  } catch (e) {
    logger.error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Failed to store block ${b.number}: ${(e as Error)?.stack ?? e}`
    );
  }
};
