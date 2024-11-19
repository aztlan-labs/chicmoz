import { getDb as db } from "../../../database/index.js";
import { logger } from "../../../logger.js";
import { l2Tx } from "../../schema/index.js";

export const deleteAllTxs = async (): Promise<void> => {
  const res = (await db().delete(l2Tx).execute()).rowCount;
  logger.info(`🗑️ Deleted ${res} transactions`);
};
