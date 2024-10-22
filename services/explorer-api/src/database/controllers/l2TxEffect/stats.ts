import { and, count, eq, gt, lt } from "drizzle-orm";
import { getDb as db } from "../../../database/index.js";
import {
  body,
  bodyToTxEffects,
  globalVariables,
  header,
  l2Block,
  txEffect,
} from "../../../database/schema/l2block/index.js";

export const getTotalTxEffects = async (): Promise<number> => {
  const dbRes = await db().select({ count: count() }).from(txEffect).execute();
  return dbRes[0].count;
};

const ONE_DAY = 24 * 60 * 60 * 1000;
export const getTotalTxEffectsLast24h = async (): Promise<number> => {
  const dbRes = await db()
    .select({ count: count() })
    .from(txEffect)
    .innerJoin(bodyToTxEffects, eq(txEffect.hash, bodyToTxEffects.txEffectHash))
    .innerJoin(body, eq(body.id, bodyToTxEffects.bodyId))
    .innerJoin(l2Block, eq(l2Block.bodyId, body.id))
    .innerJoin(header, eq(header.id, l2Block.headerId))
    .innerJoin(
      globalVariables,
      eq(globalVariables.id, header.globalVariablesId)
    )
    .where(
      and(
        gt(globalVariables.timestamp, Date.now() - ONE_DAY),
        lt(globalVariables.timestamp, Date.now())
      )
    )
    .execute();
  return dbRes[0].count;
};
