import { NewBlockEvent } from "@chicmoz-pkg/message-registry";
import { parseBlock, blockFromString } from "@chicmoz-pkg/backend-utils";
import { logger } from "../logger.js";
import { sendBlockToClients } from "../ws-server/index.js";

export const onBlock = ({ block, blockNumber }: NewBlockEvent) => {
  if (!block) {
    logger.error("🚫 Block is empty");
    return;
  }
  logger.info(`👓 Parsing block ${blockNumber}`);
  let parsedBlock;
  try {
    const b = blockFromString(block);
    parsedBlock = parseBlock(b);
  } catch (e) {
    logger.error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Failed to parse block ${blockNumber}: ${e}`
    );
    return;
  }
  sendBlockToClients(parsedBlock);
  // TODO: add contracts!
};
