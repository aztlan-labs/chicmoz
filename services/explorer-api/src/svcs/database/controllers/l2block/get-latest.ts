import { ChicmozL2BlockLight } from "@chicmoz-pkg/types";
import { desc } from "drizzle-orm";
import { getDb as db } from "@chicmoz-pkg/postgres-helper";
import { l2Block } from "../../../database/schema/l2block/index.js";
import { getBlock } from "./get-block.js";

export const getLatestBlock = async (): Promise<ChicmozL2BlockLight | null> => {
  return getBlock(-1);
};

export const getLatestHeight = async (): Promise<number | null> => {
  const latestBlockNumber = await db()
    .select({ height: l2Block.height })
    .from(l2Block)
    .orderBy(desc(l2Block.height))
    .limit(1)
    .execute();
  if (latestBlockNumber.length === 0) return null;
  return Number(latestBlockNumber[0].height);
}
