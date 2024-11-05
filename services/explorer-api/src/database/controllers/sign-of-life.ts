import { desc, eq, sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { getDb as db } from "../../database/index.js";
import {
  bodyToTxEffects,
  l2Block,
  txEffect,
} from "../../database/schema/l2block/index.js";
import { l2ContractInstanceDeployed, l2PrivateFunction, l2UnconstrainedFunction } from "../schema/index.js";

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
      txEffects:
        sql<string>`COALESCE(json_agg(json_build_object('hash', ${txEffect.hash}, 'index', ${txEffect.index})) FILTER (WHERE ${txEffect.hash} IS NOT NULL), '[]'::json)`.as(
          "txEffects"
        ),
      txEffectCount: sql<number>`count(${txEffect.hash})`.as("txEffectCount"),
    })
    .from(bodyToTxEffects)
    .innerJoin(txEffect, eq(bodyToTxEffects.txEffectHash, txEffect.hash))
    .innerJoin(l2Block, eq(bodyToTxEffects.bodyId, l2Block.bodyId))
    .groupBy(l2Block.height, l2Block.hash)
    .orderBy(sql`count(${txEffect.hash}) DESC, ${l2Block.height} DESC`)
    .limit(1)
    .execute();

  if (dbRes.length === 0) return null;

  const result = dbRes[0];
  return {
    block: {
      height: Number(result.block.height),
      hash: result.block.hash,
    },
    txEffects: (
      result.txEffects as unknown as Array<{ hash: string; index: string }>
    ).map((te) => ({
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
        address: l2ContractInstanceDeployed.address,
        version: l2ContractInstanceDeployed.version,
        classId: l2ContractInstanceDeployed.contractClassId,
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
      address: dbRes[0].l2ContractInstanceDeployed.address,
      version: dbRes[0].l2ContractInstanceDeployed.version,
      classId: dbRes[0].l2ContractInstanceDeployed.classId,
    },
  };
};

const getAL2PrivateFunction = async () => {
  const dbRes = await db()
    .select({
      classId: l2PrivateFunction.contractClassId,
      functionSelector: l2PrivateFunction.privateFunction_selector_value,
    })
    .from(l2PrivateFunction)
    .limit(1)
    .execute();
  if (dbRes.length === 0) return null;
  return dbRes[0];
}

const getAL2UnconstrainedFunction = async () => {
  const dbRes = await db()
    .select({
      classId: l2UnconstrainedFunction.contractClassId,
      functionSelector: l2UnconstrainedFunction.unconstrainedFunction_selector_value,
    })
    .from(l2UnconstrainedFunction)
    .limit(1)
    .execute();
  if (dbRes.length === 0) return null;
  return dbRes[0]
}

export const getL2ContractFunctions = async () => {
  const [privateFunction, unconstrainedFunction] = await Promise.all([
    getAL2PrivateFunction(),
    getAL2UnconstrainedFunction(),
  ]);
  return {
    privateFunction,
    unconstrainedFunction,
  };
};
