/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { L2Block } from "@aztec/aztec.js";
import { logger } from "../../logger.js";
import { getDb as db } from "../index.js";
import { l2Block } from "../schema/index.js";
import { desc } from "drizzle-orm";

const getLatest = async () => {
  logger.info(`Getting latest block...`);
  const res = await db().select().from(l2Block).orderBy(desc(l2Block.number)).limit(1).execute();
  if (res.length === 0) return null;
  return res[0];
};

const store = async (block: L2Block) => {
  logger.info(`Storing block ${block.number}...`);
  const hash = block?.hash()?.toBigInt() as bigint;
  if (!hash) throw new Error(`Block ${block.number} hash is not a bigint`);
  return db().insert(l2Block).values({
    number: block.number,
    hash,
    timestamp: block.getStats().blockTimestamp,
    archive: block.archive,
    header: block.header,
    body: block.body,
  });
};

export const block = {
  getLatest,
  store,
};
