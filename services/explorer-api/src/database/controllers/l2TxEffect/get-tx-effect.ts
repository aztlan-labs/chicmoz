import {
  ChicmozL2TxEffect,
  ChicmozL2TxEffectDeluxe,
  EncryptedLogEntry,
  HexString,
  NoteEncryptedLogEntry,
  UnencryptedLogEntry,
  chicmozL2TxEffectDeluxeSchema,
  encryptedLogEntrySchema,
  noteEncryptedLogEntrySchema,
  unencryptedLogEntrySchema,
} from "@chicmoz-pkg/types";
import { SQL, and, asc, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { DB_MAX_TX_EFFECTS } from "../../../environment.js";
import { getDb as db } from "../../../database/index.js";
import {
  body,
  functionLogs,
  globalVariables,
  header,
  l2Block,
  logs,
  publicDataWrite,
  txEffect,
  txEffectToLogs,
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
): Promise<
  Pick<
    ChicmozL2TxEffect,
    | "publicDataWrites"
    | "noteEncryptedLogs"
    | "encryptedLogs"
    | "unencryptedLogs"
  >
> => {
  const publicDataWrites = await db()
    .select({
      publicDataWrite: getTableColumns(publicDataWrite),
    })
    .from(publicDataWrite)
    .innerJoin(
      txEffect,
      eq(txEffect.hash, publicDataWrite.txEffectHash)
    )
    .where(eq(publicDataWrite.txEffectHash, txEffectHash))
    .orderBy(asc(publicDataWrite.index))
    .execute();

  const mixedLogs = await db()
    .select({
      functionLogIndex: functionLogs.index,
      ...getTableColumns(logs),
    })
    .from(txEffectToLogs)
    .innerJoin(logs, eq(txEffectToLogs.id, logs.txEffectToLogsId))
    .innerJoin(functionLogs, eq(txEffectToLogs.id, functionLogs.txEffectToLogsId))
    .where(eq(txEffectToLogs.txEffectHash, txEffectHash))
    .orderBy(asc(functionLogs.index), asc(logs.index))
    .execute();

  const {
    highestIndexNoteEncryptedLogs,
    highestIndexEncryptedLogs,
    highestIndexUnencryptedLogs,
  } = mixedLogs.reduce(
    (acc, { functionLogIndex }) => ({
      highestIndexNoteEncryptedLogs: Math.max(
        acc.highestIndexNoteEncryptedLogs,
        functionLogIndex
      ),
      highestIndexEncryptedLogs: Math.max(
        acc.highestIndexEncryptedLogs,
        functionLogIndex
      ),
      highestIndexUnencryptedLogs: Math.max(
        acc.highestIndexUnencryptedLogs,
        functionLogIndex
      ),
    }),
    {
      highestIndexNoteEncryptedLogs: -1,
      highestIndexEncryptedLogs: -1,
      highestIndexUnencryptedLogs: -1,
    }
  );

  const initialLogs = {
    noteEncryptedLogs: {
      functionLogs: new Array<{ logs: NoteEncryptedLogEntry[] }>(
        highestIndexNoteEncryptedLogs + 1
      ).fill({ logs: [] }),
    },
    encryptedLogs: {
      functionLogs: new Array<{ logs: EncryptedLogEntry[] }>(
        highestIndexEncryptedLogs + 1
      ).fill({ logs: [] }),
    },
    unencryptedLogs: {
      functionLogs: new Array<{ logs: UnencryptedLogEntry[] }>(
        highestIndexUnencryptedLogs + 1
      ).fill({ logs: [] }),
    },
  };

  for (const log of mixedLogs) {
    if (log.type === "noteEncrypted") {
      const l = noteEncryptedLogEntrySchema.parse(log);
      initialLogs.noteEncryptedLogs.functionLogs[
        log.functionLogIndex
      ].logs.push(l);
    } else if (log.type === "encrypted") {
      const l = encryptedLogEntrySchema.parse(log);
      initialLogs.encryptedLogs.functionLogs[log.functionLogIndex].logs.push(l);
    } else if (log.type === "unencrypted") {
      const l = unencryptedLogEntrySchema.parse(log);
      initialLogs.unencryptedLogs.functionLogs[log.functionLogIndex].logs.push(
        l
      );
    }
  }

  return {
    publicDataWrites: publicDataWrites.map((pdw) => pdw.publicDataWrite),
    ...initialLogs,
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
    .innerJoin(
      globalVariables,
      eq(header.id, globalVariables.headerId)
    );

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
      const nestedData = await getTxEffectNestedByHash(txEffect.hash);
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
  return getTxEffectDynamicWhere(eq(txEffect.hash, hash));
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
    .innerJoin(
      globalVariables,
      eq(header.id, globalVariables.headerId)
    )
    .where(whereMatcher)
    .limit(1)
    .execute();

  if (dbRes.length === 0) return null;

  const nestedData = await getTxEffectNestedByHash(dbRes[0].hash);

  return chicmozL2TxEffectDeluxeSchema.parse({
    ...dbRes[0],
    txBirthTimestamp: dbRes[0].txBirthTimestamp.valueOf(),
    ...nestedData,
  });
};
