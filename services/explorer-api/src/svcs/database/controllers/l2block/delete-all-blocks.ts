import { getDb as db } from "@chicmoz-pkg/postgres-helper";
import { l2Block } from "../../../database/schema/l2block/index.js";
import { logger } from "../../../../logger.js";

export const deleteAllBlocks = async (): Promise<void> => {
  const res = (await db().delete(l2Block).execute()).rowCount;
  logger.info(`🗑️ Deleted ${res} blocks`);
};
