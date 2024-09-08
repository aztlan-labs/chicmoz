import { ChicmozL2Block, chicmozL2BlockSchema } from "@chicmoz-pkg/types";
import { asc, desc, eq, getTableColumns } from "drizzle-orm";
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

export const getLatest = async (): Promise<ChicmozL2Block | null> => {
  const res = await db()
    .select({
      hash: l2Block.hash,
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
    .innerJoin(body, eq(l2Block.bodyId, body.id))
    .orderBy(desc(globalVariables.blockNumber))
    .limit(1)
    .execute();

  if (res.length === 0) return null;

  const dbRes = res[0];

  // Fetch txEffects and related data
  const txEffectsData = await db()
    .select({
      txEffect: getTableColumns(txEffect),
      publicDataWrite: getTableColumns(publicDataWrite),
      logs: getTableColumns(logs),
      functionLogs: getTableColumns(functionLogs),
    })
    .from(bodyToTxEffects)
    .innerJoin(txEffect, eq(bodyToTxEffects.txEffectId, txEffect.id))
    .leftJoin(
      txEffectToPublicDataWrite,
      eq(txEffect.id, txEffectToPublicDataWrite.txEffectId)
    )
    .leftJoin(
      publicDataWrite,
      eq(txEffectToPublicDataWrite.publicDataWriteId, publicDataWrite.id)
    )
    .leftJoin(txEffectToLogs, eq(txEffect.id, txEffectToLogs.txEffectId))
    .leftJoin(logs, eq(txEffectToLogs.logId, logs.id))
    .leftJoin(functionLogs, eq(txEffectToLogs.functionLogId, functionLogs.id))
    .where(eq(bodyToTxEffects.bodyId, dbRes.bodyId))
    .orderBy(asc(txEffect.index))
    .execute();

  const txEffects = txEffectsData.map((data) => ({
    ...data.txEffect,
    publicDataWrites: data.publicDataWrite ? [data.publicDataWrite] : [],
    logs: data.logs ? [data.logs] : [],
    functionLogs: data.functionLogs ? [data.functionLogs] : [],
  }));

  const blockData = {
    hash: dbRes.hash,
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

  const block = chicmozL2BlockSchema.parse(blockData);

  return block;
};
