import { count } from "drizzle-orm";
import { getDb as db } from "../../../database/index.js";
import { txEffect } from "../../../database/schema/index.js";

export const getTotalTxEffects = async (): Promise<number> => {
  const dbRes = await db().select({ count: count() }).from(txEffect).execute();
  return dbRes[0].count;
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getTotalTxEffectsLast24h = async (): Promise<number> => {
  // TODO: we need l2Block.header.globalVariables.timestamp as number to sum this
  return -1;
}
