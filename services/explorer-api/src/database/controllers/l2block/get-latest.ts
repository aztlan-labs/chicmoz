import { ChicmozL2Block } from "@chicmoz-pkg/types";
import { desc } from "drizzle-orm";
import { getDb as db } from "../../../database/index.js";
import { l2Block } from "../../../database/schema/l2block/index.js";
import { getBlock } from "./get-block.js";

export const getLatestBlock = async (): Promise<ChicmozL2Block | null> => {
  const latestBlockNumber = await db()
    .select({ height: l2Block.height })
    .from(l2Block)
    .orderBy(desc(l2Block.height))
    .limit(1)
    .execute();

  if (latestBlockNumber.length === 0) return null;

  return getBlock(Number(latestBlockNumber[0].height));
};
