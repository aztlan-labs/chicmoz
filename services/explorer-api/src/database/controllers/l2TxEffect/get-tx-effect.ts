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
import { and, asc, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { getDb as db } from "../../../database/index.js";
import {
  bodyToTxEffects,
  functionLogs,
  globalVariables,
  header,
  l2Block,
  logs,
  publicDataWrite,
  txEffect,
  txEffectToLogs,
  txEffectToPublicDataWrite,
} from "../../../database/schema/l2block/index.js";
// TODO: this should be removed (and caught by dbWrapper)
import { dbParseErrorCallback } from "../utils.js";

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

export const getTxEffectNestedById = async (
  txId: string
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
    .from(txEffectToPublicDataWrite)
    .innerJoin(
      publicDataWrite,
      eq(txEffectToPublicDataWrite.publicDataWriteId, publicDataWrite.id)
    )
    .where(eq(txEffectToPublicDataWrite.txEffectId, txId))
    .orderBy(asc(txEffectToPublicDataWrite.index))
    .execute();

  const mixedLogs = await db()
    .select({
      functionLogIndex: functionLogs.index,
      ...getTableColumns(logs),
    })
    .from(txEffectToLogs)
    .innerJoin(logs, eq(txEffectToLogs.logId, logs.id))
    .innerJoin(functionLogs, eq(txEffectToLogs.functionLogId, functionLogs.id))
    .where(eq(txEffectToLogs.txEffectId, txId))
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
      const l = await noteEncryptedLogEntrySchema
        .parseAsync(log)
        .catch(dbParseErrorCallback);
      initialLogs.noteEncryptedLogs.functionLogs[
        log.functionLogIndex
      ].logs.push(l);
    } else if (log.type === "encrypted") {
      const l = await encryptedLogEntrySchema
        .parseAsync(log)
        .catch(dbParseErrorCallback);
      initialLogs.encryptedLogs.functionLogs[log.functionLogIndex].logs.push(l);
    } else if (log.type === "unencrypted") {
      const l = await unencryptedLogEntrySchema
        .parseAsync(log)
        .catch(dbParseErrorCallback);
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
    .innerJoin(bodyToTxEffects, eq(txEffect.id, bodyToTxEffects.txEffectId))
    .innerJoin(l2Block, eq(bodyToTxEffects.bodyId, l2Block.bodyId))
    .innerJoin(header, eq(l2Block.headerId, header.id))
    .innerJoin(globalVariables, eq(header.globalVariablesId, globalVariables.id))

  let whereQuery;

  switch (args.getType) {
    case GetTypes.BlockHeight:
      whereQuery = joinQuery
        .where(eq(l2Block.height, args.blockHeight))
        .orderBy(asc(txEffect.index));
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
      const nestedData = await getTxEffectNestedById(txEffect.id);
      return {
        ...txEffect,
        ...nestedData,
      };
    })
  );

  return z
    .array(chicmozL2TxEffectDeluxeSchema)
    .parseAsync(txEffects)
    .catch(dbParseErrorCallback);
};

export const getTxeffectByHash = async (
  hash: HexString,
): Promise<ChicmozL2TxEffectDeluxe | null> => {
  const dbRes = await db()
    .select({
      ...getTableColumns(txEffect),
      blockHeight: l2Block.height,
      timestamp: globalVariables.timestamp
    })
    .from(txEffect)
    .innerJoin(bodyToTxEffects, eq(txEffect.id, bodyToTxEffects.txEffectId))
    .innerJoin(l2Block, eq(bodyToTxEffects.bodyId, l2Block.bodyId))
    .innerJoin(header, eq(l2Block.headerId, header.id))
    .innerJoin(globalVariables, eq(header.globalVariablesId, globalVariables.id))
    .where(eq(txEffect.hash, hash))
    .limit(1)
    .execute();

  if (dbRes.length === 0) return null;

  const nestedData = await getTxEffectNestedById(dbRes[0].id);

  return chicmozL2TxEffectDeluxeSchema
    .parseAsync({
      ...dbRes[0],
      ...nestedData,
    })
    .catch(dbParseErrorCallback);
};
