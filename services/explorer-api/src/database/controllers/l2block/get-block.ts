import {
  ChicmozL2Block,
  EncryptedLogEntry,
  NoteEncryptedLogEntry,
  UnencryptedLogEntry,
  chicmozL2BlockSchema,
  encryptedLogEntrySchema,
  noteEncryptedLogEntrySchema,
  unencryptedLogEntrySchema,
} from "@chicmoz-pkg/types";
import { asc, eq, getTableColumns } from "drizzle-orm";
import { getDb as db } from "../../../database/index.js";
import {
  archive,
  body,
  bodyToTxEffects,
  contentCommitment,
  functionLogs,
  gasFees,
  globalVariables,
  header,
  l1ToL2MessageTree,
  l2Block,
  lastArchive,
  logs,
  noteHashTree,
  nullifierTree,
  partial,
  publicDataTree,
  publicDataWrite,
  state,
  txEffect,
  txEffectToLogs,
  txEffectToPublicDataWrite,
} from "../../../database/schema/l2block/index.js";
import { dbParseErrorCallback } from "../utils.js";

export const getBlock = async (
  heightOrHash: number | string
): Promise<ChicmozL2Block | null> => {
  const joinQuery = db()
    .select({
      // TODO: can this be simplified using getTableColumns?
      hash: l2Block.hash,
      height: l2Block.height,
      archiveRoot: archive.root,
      archiveNextAvailableLeafIndex: archive.nextAvailableLeafIndex,
      headerLastArchiveRoot: lastArchive.root,
      headerLastArchiveNextAvailableLeafIndex:
        lastArchive.nextAvailableLeafIndex,
      headerTotalFees: header.totalFees,
      ccNumTxs: contentCommitment.numTxs,
      ccTxsEffectsHash: contentCommitment.txsEffectsHash,
      ccInHash: contentCommitment.inHash,
      ccOutHash: contentCommitment.outHash,
      stateL1ToL2MessageTreeRoot: l1ToL2MessageTree.root,
      stateL1ToL2MessageTreeNextAvailableLeafIndex:
        l1ToL2MessageTree.nextAvailableLeafIndex,
      stateNoteHashTreeRoot: noteHashTree.root,
      stateNoteHashTreeNextAvailableLeafIndex:
        noteHashTree.nextAvailableLeafIndex,
      stateNullifierTreeRoot: nullifierTree.root,
      stateNullifierTreeNextAvailableLeafIndex:
        nullifierTree.nextAvailableLeafIndex,
      statePublicDataTreeRoot: publicDataTree.root,
      statePublicDataTreeNextAvailableLeafIndex:
        publicDataTree.nextAvailableLeafIndex,
      gvChainId: globalVariables.chainId,
      gvVersion: globalVariables.version,
      gvBlockNumber: globalVariables.blockNumber,
      gvSlotNumber: globalVariables.slotNumber,
      gvTimestamp: globalVariables.timestamp,
      gvCoinbase: globalVariables.coinbase,
      gvFeeRecipient: globalVariables.feeRecipient,
      gvGasFeesFeePerDaGas: gasFees.feePerDaGas,
      gvGasFeesFeePerL2Gas: gasFees.feePerL2Gas,
      bodyId: body.id,
    })
    .from(l2Block)
    .innerJoin(archive, eq(l2Block.archiveId, archive.id))
    .innerJoin(header, eq(l2Block.headerId, header.id))
    .innerJoin(lastArchive, eq(header.lastArchiveId, lastArchive.id))
    .innerJoin(
      contentCommitment,
      eq(header.contentCommitmentId, contentCommitment.id)
    )
    .innerJoin(state, eq(header.stateId, state.id))
    .innerJoin(
      l1ToL2MessageTree,
      eq(state.l1ToL2MessageTreeId, l1ToL2MessageTree.id)
    )
    .innerJoin(partial, eq(state.partialId, partial.id))
    .innerJoin(noteHashTree, eq(partial.noteHashTreeId, noteHashTree.id))
    .innerJoin(nullifierTree, eq(partial.nullifierTreeId, nullifierTree.id))
    .innerJoin(publicDataTree, eq(partial.publicDataTreeId, publicDataTree.id))
    .innerJoin(
      globalVariables,
      eq(header.globalVariablesId, globalVariables.id)
    )
    .innerJoin(gasFees, eq(globalVariables.gasFeesId, gasFees.id))
    .innerJoin(body, eq(l2Block.bodyId, body.id));

  const res =
    typeof heightOrHash === "number" || !isNaN(Number(heightOrHash))
      ? await joinQuery
          .where(eq(l2Block.height, Number(heightOrHash)))
          .limit(1)
          .execute()
      : await joinQuery
          .where(eq(l2Block.hash, heightOrHash))
          .limit(1)
          .execute();

  if (res.length === 0) return null;

  const dbRes = res[0];

  const txEffectsData = await db()
    .select({
      txEffect: getTableColumns(txEffect),
    })
    .from(bodyToTxEffects)
    .innerJoin(txEffect, eq(bodyToTxEffects.txEffectId, txEffect.id))
    .where(eq(bodyToTxEffects.bodyId, dbRes.bodyId))
    .orderBy(asc(txEffect.index))
    .execute();

  // TODO: might be better to do this async
  const txEffects = await Promise.all(
    txEffectsData.map(async (data) => {
      const publicDataWrites = await db()
        .select({
          publicDataWrite: getTableColumns(publicDataWrite),
        })
        .from(txEffectToPublicDataWrite)
        .innerJoin(
          publicDataWrite,
          eq(txEffectToPublicDataWrite.publicDataWriteId, publicDataWrite.id)
        )
        .where(eq(txEffectToPublicDataWrite.txEffectId, data.txEffect.id))
        .orderBy(asc(txEffectToPublicDataWrite.index))
        .execute();

      const mixedLogs = await db()
        .select({
          functionLogIndex: functionLogs.index,
          ...getTableColumns(logs),
        })
        .from(txEffectToLogs)
        .innerJoin(logs, eq(txEffectToLogs.logId, logs.id))
        .innerJoin(
          functionLogs,
          eq(txEffectToLogs.functionLogId, functionLogs.id)
        )
        .where(eq(txEffectToLogs.txEffectId, data.txEffect.id))
        .orderBy(asc(functionLogs.index), asc(logs.index))
        .execute();

      const {
        heigestIndexNoteEncryptedLogs,
        heigestIndexEncryptedLogs,
        heigestIndexUnencryptedLogs,
      } = mixedLogs.reduce(
        (acc, { functionLogIndex }) => {
          if (functionLogIndex > acc.heigestIndexNoteEncryptedLogs)
            acc.heigestIndexNoteEncryptedLogs = functionLogIndex;
          if (functionLogIndex > acc.heigestIndexEncryptedLogs)
            acc.heigestIndexEncryptedLogs = functionLogIndex;
          if (functionLogIndex > acc.heigestIndexUnencryptedLogs)
            acc.heigestIndexUnencryptedLogs = functionLogIndex;

          return acc;
        },
        {
          heigestIndexNoteEncryptedLogs: -1,
          heigestIndexEncryptedLogs: -1,
          heigestIndexUnencryptedLogs: -1,
        }
      );
      const initialLogs = {
        noteEncryptedLogs: {
          functionLogs: new Array<{ logs: NoteEncryptedLogEntry[] }>(
            heigestIndexNoteEncryptedLogs + 1
          ).fill({ logs: [] }),
        },
        encryptedLogs: {
          functionLogs: new Array<{ logs: EncryptedLogEntry[] }>(
            heigestIndexEncryptedLogs + 1
          ).fill({ logs: [] }),
        },
        unencryptedLogs: {
          functionLogs: new Array<{ logs: UnencryptedLogEntry[] }>(
            heigestIndexUnencryptedLogs + 1
          ).fill({ logs: [] }),
        },
      } as {
        noteEncryptedLogs: ChicmozL2Block["body"]["txEffects"][0]["noteEncryptedLogs"];
        encryptedLogs: ChicmozL2Block["body"]["txEffects"][0]["encryptedLogs"];
        unencryptedLogs: ChicmozL2Block["body"]["txEffects"][0]["unencryptedLogs"];
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
          initialLogs.encryptedLogs.functionLogs[
            log.functionLogIndex
          ].logs.push(l);
        } else if (log.type === "unencrypted") {
          const l = await unencryptedLogEntrySchema
            .parseAsync(log)
            .catch(dbParseErrorCallback);
          initialLogs.unencryptedLogs.functionLogs[
            log.functionLogIndex
          ].logs.push(l);
        }
      }

      return {
        ...data.txEffect,
        publicDataWrites: publicDataWrites.map((pdw) => pdw.publicDataWrite),
        noteEncryptedLogs: initialLogs.noteEncryptedLogs,
        encryptedLogs: initialLogs.encryptedLogs,
        unencryptedLogs: initialLogs.unencryptedLogs,
      };
    })
  );

  const blockData = {
    hash: dbRes.hash,
    height: dbRes.height,
    archive: {
      root: dbRes.archiveRoot,
      nextAvailableLeafIndex: dbRes.archiveNextAvailableLeafIndex,
    },
    header: {
      lastArchive: {
        root: dbRes.headerLastArchiveRoot,
        nextAvailableLeafIndex: dbRes.headerLastArchiveNextAvailableLeafIndex,
      },
      totalFees: dbRes.headerTotalFees,
      contentCommitment: {
        numTxs: dbRes.ccNumTxs,
        txsEffectsHash: dbRes.ccTxsEffectsHash,
        inHash: dbRes.ccInHash,
        outHash: dbRes.ccOutHash,
      },
      state: {
        l1ToL2MessageTree: {
          root: dbRes.stateL1ToL2MessageTreeRoot,
          nextAvailableLeafIndex:
            dbRes.stateL1ToL2MessageTreeNextAvailableLeafIndex,
        },
        partial: {
          noteHashTree: {
            root: dbRes.stateNoteHashTreeRoot,
            nextAvailableLeafIndex:
              dbRes.stateNoteHashTreeNextAvailableLeafIndex,
          },
          nullifierTree: {
            root: dbRes.stateNullifierTreeRoot,
            nextAvailableLeafIndex:
              dbRes.stateNullifierTreeNextAvailableLeafIndex,
          },
          publicDataTree: {
            root: dbRes.statePublicDataTreeRoot,
            nextAvailableLeafIndex:
              dbRes.statePublicDataTreeNextAvailableLeafIndex,
          },
        },
      },
      globalVariables: {
        chainId: dbRes.gvChainId,
        version: dbRes.gvVersion,
        blockNumber: dbRes.gvBlockNumber,
        slotNumber: dbRes.gvSlotNumber,
        timestamp: dbRes.gvTimestamp,
        coinbase: dbRes.gvCoinbase,
        feeRecipient: dbRes.gvFeeRecipient,
        gasFees: {
          feePerDaGas: dbRes.gvGasFeesFeePerDaGas,
          feePerL2Gas: dbRes.gvGasFeesFeePerL2Gas,
        },
      },
    },
    body: {
      txEffects: txEffects,
    },
  };

  const block = await chicmozL2BlockSchema
    .parseAsync(blockData)
    .catch(dbParseErrorCallback);

  return block;
};
