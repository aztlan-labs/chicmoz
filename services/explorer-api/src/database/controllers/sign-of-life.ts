import { desc, eq, sql } from "drizzle-orm";
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { getDb as db } from "../../database/index.js";
import {
  bodyToTxEffects,
  l2Block,
  txEffect,
} from "../../database/schema/l2block/index.js";
import {l2ContractInstanceDeployed} from "../schema/index.js";

export const getABlock = async () => {
  const res = await db()
    .select({
      height: l2Block.height,
      hash: l2Block.hash,
    })
    .from(l2Block)
    .orderBy(desc(l2Block.height))
    .limit(1)
    .execute();
  if (res.length === 0) return null;
  return {
    height: Number(res[0].height),
    hash: res[0].hash,
  };
};

export const getABlockWithTxEffects = async () => {
  const dbInstance = db() as NodePgDatabase;
  const dbRes = await dbInstance
    .select({
      block: {
        height: l2Block.height,
        hash: l2Block.hash,
      },
      txEffects: sql<string>`COALESCE(json_agg(json_build_object('hash', ${txEffect.hash}, 'index', ${txEffect.index})) FILTER (WHERE ${txEffect.id} IS NOT NULL), '[]'::json)`.as('txEffects'),
      txEffectCount: sql<number>`count(${txEffect.id})`.as('txEffectCount'),
    })
    .from(bodyToTxEffects)
    .innerJoin(txEffect, eq(bodyToTxEffects.txEffectId, txEffect.id))
    .innerJoin(l2Block, eq(bodyToTxEffects.bodyId, l2Block.bodyId))
    .groupBy(l2Block.height, l2Block.hash)
    .orderBy(sql`count(${txEffect.id}) DESC, ${l2Block.height} DESC`)
    .limit(1)
    .execute();

  if (dbRes.length === 0) return null;

  const result = dbRes[0];
  return {
    block: {
      height: Number(result.block.height),
      hash: result.block.hash,
    },
    txEffects: (result.txEffects as unknown as Array<{ hash: string; index: string }>).map(te => ({
      hash: te.hash,
      index: Number(te.index),
    })),
  };
};

export const getABlockWithContractInstances = async () => {
  const dbRes = await db()
  .select({
    l2Block: {
      height: l2Block.height,
      hash: l2Block.hash,
    },
    l2ContractInstanceDeployed: {
      classId: l2ContractInstanceDeployed.contractClassId,
      address: l2ContractInstanceDeployed.address,
      version: l2ContractInstanceDeployed.version,
      // TODO: classId: l2ContractInstanceDeployed.contractClassId,
    },
  })
  .from(l2Block)
  .innerJoin(
    l2ContractInstanceDeployed,
    eq(l2Block.hash, l2ContractInstanceDeployed.blockHash)
  )
  .limit(1)
  .execute();
  if (dbRes.length === 0) return null;
  return {
    block: {
      height: Number(dbRes[0].l2Block.height),
      hash: dbRes[0].l2Block.hash,
    },
    contractInstance: {
      classId: dbRes[0].l2ContractInstanceDeployed.classId,
      address: dbRes[0].l2ContractInstanceDeployed.address,
      version: dbRes[0].l2ContractInstanceDeployed.version,
    },
  };
}
