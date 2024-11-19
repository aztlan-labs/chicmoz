import { deleteAllTxs } from "../database/controllers/l2Tx/delete-all-txs.js";
import { deleteAllBlocks } from "../database/controllers/l2block/delete-all-blocks.js";
import { NODE_ENV } from "../environment.js";
import { logger } from "../logger.js";

export const onNewChainDetected = async () => {
  if (NODE_ENV === "development") {
    logger.info("NEW CHAIN DETECTED - clearing DB");
    await Promise.all([deleteAllBlocks(), deleteAllTxs()]);
  } else {
    throw new Error("NEW CHAIN DETECTED - shutting down");
  }
};
