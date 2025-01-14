import { NODE_ENV } from "@chicmoz-pkg/microservice-base";
import { logger } from "../../logger.js";
import { deleteAllTxs } from "../../svcs/database/controllers/l2Tx/delete-all-txs.js";
import { deleteAllBlocks } from "../../svcs/database/controllers/l2block/delete-all-blocks.js";

export const onNewChainDetected = async () => {
  if (NODE_ENV === "development") {
    logger.info("NEW CHAIN DETECTED - clearing DB");
    await Promise.all([deleteAllBlocks(), deleteAllTxs()]);
  } else {
    throw new Error("NEW CHAIN DETECTED - shutting down");
  }
};
