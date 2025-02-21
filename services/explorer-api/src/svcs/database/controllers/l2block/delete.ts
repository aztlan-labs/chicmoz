import { getDb as db } from "@chicmoz-pkg/postgres-helper";
import { HexString } from "@chicmoz-pkg/types";
import { eq } from "drizzle-orm";
import { logger } from "../../../../logger.js";
import { l2Block } from "../../../database/schema/l2block/index.js";

export const deleteAllBlocks = async (): Promise<void> => {
  const res = (await db().delete(l2Block).execute()).rowCount;
  logger.info(`🗑️ Deleted ${res} blocks`);
};

export const deleteL2BlockByHash = async (hash: HexString): Promise<void> => {
  await db().delete(l2Block).where(eq(l2Block.hash, hash)).execute();
};
