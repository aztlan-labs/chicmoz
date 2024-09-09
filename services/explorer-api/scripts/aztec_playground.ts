import { createPXEClient } from "@aztec/aztec.js";
import { logger } from "../src/logger.js";
import { reconstructedL2BlockSchema } from "../src/types/block.js";

const AZTEC_NODE_URL = "http://localhost:8080";

const testType = (dbBlock: unknown) => { const b = reconstructedL2BlockSchema.parse(dbBlock); const nbr = parseInt(b.header.globalVariables.blockNumber.toString());
  logger.info(nbr);
};

const main = async () => {
  const pxe = createPXEClient(AZTEC_NODE_URL);
  const latestHeight = await pxe.getBlockNumber();
  const block = await pxe.getBlock(latestHeight);

  if (!block) {
    logger.error(`Failed to get block ${latestHeight}`);
    return;
  }

  const hash = block?.hash()?.toString() ;
  const sentToDb = {
    number: block.number,
    hash,
    timestamp: block.getStats().blockTimestamp,
    archive: block.archive,
    header: block.header,
    body: block.body,
  };
  testType(JSON.parse(JSON.stringify(sentToDb)));
  // logger.info(JSON.stringify(dbBlock, null, 2));
};

main().catch((e) => {
  logger.error(`Failed to investigate block: ${e}`);
});
