import {
  ChicmozL2Transaction,
  EncryptedLogEntry,
  NoteEncryptedLogEntry,
  UnencryptedLogEntry,
  chicmozL2TransactionSchema,
  encryptedLogEntrySchema,
  noteEncryptedLogEntrySchema,
  unencryptedLogEntrySchema,
} from "@chicmoz-pkg/types";
import { asc, eq, and, getTableColumns } from "drizzle-orm";
import { getDb as db } from "../../../database/index.js";
import {
  l2Block,
  body,
  bodyToTxEffects,
  txEffect,
  txEffectToPublicDataWrite,
  publicDataWrite,
  txEffectToLogs,
  logs,
  functionLogs,
} from "../../../database/schema/l2block/index.js";
import { dbParseErrorCallback } from "../utils.js";

export const getTransaction = async (
  blockHeight: number,
  transactionIndex: number
): Promise<ChicmozL2Transaction | null> => {
  const txEffectData = await db()
    .select({
      txEffect: getTableColumns(txEffect),
    })
    .from(l2Block)
    .innerJoin(body, eq(l2Block.bodyId, body.id))
    .innerJoin(bodyToTxEffects, eq(body.id, bodyToTxEffects.bodyId))
    .innerJoin(txEffect, eq(bodyToTxEffects.txEffectId, txEffect.id))
    .where(
      and(eq(l2Block.height, blockHeight), eq(txEffect.index, transactionIndex))
    )
    .execute();

  if (txEffectData.length === 0) return null;

  const txEffectResult = txEffectData[0];

  const publicDataWrites = await db()
    .select({
      publicDataWrite: getTableColumns(publicDataWrite),
    })
    .from(txEffectToPublicDataWrite)
    .innerJoin(
      publicDataWrite,
      eq(txEffectToPublicDataWrite.publicDataWriteId, publicDataWrite.id)
    )
    .where(eq(txEffectToPublicDataWrite.txEffectId, txEffectResult.txEffect.id))
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
    .where(eq(txEffectToLogs.txEffectId, txEffectResult.txEffect.id))
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

  const transactionData = {
    ...txEffectResult.txEffect,
    publicDataWrites,
    noteEncryptedLogs: initialLogs.noteEncryptedLogs,
    encryptedLogs: initialLogs.encryptedLogs,
    unencryptedLogs: initialLogs.unencryptedLogs,
  };

  const transaction = await chicmozL2TransactionSchema.parseAsync(transactionData).catch(dbParseErrorCallback);

  return transaction;
};
