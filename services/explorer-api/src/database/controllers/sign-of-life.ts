import { desc, eq } from "drizzle-orm";
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
  const dbRes = await db()
    .select({
      txEffect: {
        txHash: txEffect.txHash,
        index: txEffect.index,
      },
      block: {
        height: l2Block.height,
        hash: l2Block.hash,
      },
    })
    .from(bodyToTxEffects)
    .innerJoin(txEffect, eq(bodyToTxEffects.txEffectId, txEffect.id))
    .innerJoin(l2Block, eq(bodyToTxEffects.bodyId, l2Block.bodyId))
    .limit(1)
    .execute();
  if (dbRes.length === 0) return null;
  return {
    block: {
      height: Number(dbRes[0].block.height),
      hash: dbRes[0].block.hash,
    },
    txEffect: {
      txHash: dbRes[0].txEffect.txHash,
      index: Number(dbRes[0].txEffect.index),
    },
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
      address: dbRes[0].l2ContractInstanceDeployed.address,
      version: dbRes[0].l2ContractInstanceDeployed.version,
    },
  };
}
