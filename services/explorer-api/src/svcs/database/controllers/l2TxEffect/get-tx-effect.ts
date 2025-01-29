import { getDb as db } from "@chicmoz-pkg/postgres-helper";
import {
  ChicmozL2TxEffect,
  ChicmozL2TxEffectDeluxe,
  HexString,
  chicmozL2TxEffectDeluxeSchema,
} from "@chicmoz-pkg/types";
import { SQL, and, asc, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { DB_MAX_TX_EFFECTS } from "../../../../environment.js";
import {
  body,
  globalVariables,
  header,
  l2Block,
  publicDataWrite,
  txEffect,
} from "../../../database/schema/l2block/index.js";

enum GetTypes {
  BlockHeight,
  BlockHeightAndIndex,
}

type GetTxEffectByBlockHeightAndIndex = {
  blockHeight: number;
  txEffectIndex: number;
  getType: GetTypes.BlockHeightAndIndex;
};

type GetTxEffectsByBlockHeight = {
  blockHeight: number;
  getType: GetTypes.BlockHeight;
};

export const getTxEffectNestedByHash = async (
  txEffectHash: string
): Promise<Pick<ChicmozL2TxEffect, "publicDataWrites">> => {
  const publicDataWrites = await db()
    .select({
      ...getTableColumns(publicDataWrite),
    })
    .from(publicDataWrite)
    .innerJoin(txEffect, eq(txEffect.txHash, publicDataWrite.txEffectHash))
    .where(eq(publicDataWrite.txEffectHash, txEffectHash))
    .orderBy(asc(publicDataWrite.index))
    .execute();
  return {
    publicDataWrites,
  };
};

export const getTxEffectByBlockHeightAndIndex = async (
  blockHeight: number,
  txEffectIndex: number
): Promise<ChicmozL2TxEffectDeluxe | null> => {
  const res = await _getTxEffects({
    blockHeight,
    txEffectIndex,
    getType: GetTypes.BlockHeightAndIndex,
  });

  if (res.length === 0) return null;

  return res[0];
};

export const getTxEffectsByBlockHeight = async (
  height: number
): Promise<ChicmozL2TxEffectDeluxe[]> => {
  return _getTxEffects({ blockHeight: height, getType: GetTypes.BlockHeight });
};

const _getTxEffects = async (
  args: GetTxEffectByBlockHeightAndIndex | GetTxEffectsByBlockHeight
): Promise<ChicmozL2TxEffectDeluxe[]> => {
  const joinQuery = db()
    .select({
      ...getTableColumns(txEffect),
      blockHeight: l2Block.height,
      timestamp: globalVariables.timestamp,
    })
    .from(l2Block)
    .innerJoin(body, eq(l2Block.hash, body.blockHash))
    .innerJoin(txEffect, eq(body.id, txEffect.bodyId))
    .innerJoin(header, eq(l2Block.hash, header.blockHash))
    .innerJoin(globalVariables, eq(header.id, globalVariables.headerId));

  let whereQuery;

  switch (args.getType) {
    case GetTypes.BlockHeight:
      whereQuery = joinQuery
        .where(eq(l2Block.height, args.blockHeight))
        .orderBy(asc(txEffect.index))
        .limit(DB_MAX_TX_EFFECTS);
      break;
    case GetTypes.BlockHeightAndIndex:
      whereQuery = joinQuery
        .where(
          and(
            eq(l2Block.height, args.blockHeight),
            eq(txEffect.index, args.txEffectIndex)
          )
        )
        .limit(1);
      break;
  }

  const dbRes = await whereQuery.execute();

  const txEffects = await Promise.all(
    dbRes.map(async (txEffect) => {
      const nestedData = await getTxEffectNestedByHash(txEffect.txHash);
      return {
        ...txEffect,
        txBirthTimestamp: txEffect.txBirthTimestamp.valueOf(),
        ...nestedData,
      };
    })
  );

  return z.array(chicmozL2TxEffectDeluxeSchema).parse(txEffects);
};

export const getTxEffectByTxHash = async (
  txHash: HexString
): Promise<ChicmozL2TxEffectDeluxe | null> => {
  return getTxEffectDynamicWhere(eq(txEffect.txHash, txHash));
};

export const getTxEffectByHash = async (
  hash: HexString
): Promise<ChicmozL2TxEffectDeluxe | null> => {
  return getTxEffectDynamicWhere(eq(txEffect.txHash, hash));
};

export const getTxEffectDynamicWhere = async (
  whereMatcher: SQL<unknown>
): Promise<ChicmozL2TxEffectDeluxe | null> => {
  const dbRes = await db()
    .select({
      ...getTableColumns(txEffect),
      blockHeight: l2Block.height,
      timestamp: globalVariables.timestamp,
    })
    .from(txEffect)
    .innerJoin(body, eq(txEffect.bodyId, body.id))
    .innerJoin(l2Block, eq(body.blockHash, l2Block.hash))
    .innerJoin(header, eq(l2Block.hash, header.blockHash))
    .innerJoin(globalVariables, eq(header.id, globalVariables.headerId))
    .where(whereMatcher)
    .limit(1)
    .execute();

  if (dbRes.length === 0) return null;

  const nestedData = await getTxEffectNestedByHash(dbRes[0].txHash);

  return chicmozL2TxEffectDeluxeSchema.parse({
    ...dbRes[0],
    txBirthTimestamp: dbRes[0].txBirthTimestamp.valueOf(),
    ...nestedData,
  });
};
