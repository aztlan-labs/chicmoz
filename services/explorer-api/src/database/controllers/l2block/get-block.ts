import { ChicmozL2Block, chicmozL2BlockSchema } from "@chicmoz-pkg/types";
import { and, asc, eq, getTableColumns, gte, lt } from "drizzle-orm";
import { DB_MAX_BLOCKS } from "../../../environment.js";
import { getDb as db } from "../../../database/index.js";
import {
  archive,
  body,
  bodyToTxEffects,
  contentCommitment,
  gasFees,
  globalVariables,
  header,
  l1ToL2MessageTree,
  l2Block,
  lastArchive,
  noteHashTree,
  nullifierTree,
  partial,
  publicDataTree,
  state,
  txEffect,
} from "../../../database/schema/l2block/index.js";
import { dbParseErrorCallback } from "../utils.js";
import { getTxEffectNestedById } from "../l2TxEffect/get-tx-effect.js";

enum GetTypes {
  BlockHeight,
  BlockHash,
  Range,
}

type GetBlocksByHeight = {
  height: number;
  getType: GetTypes.BlockHeight;
};

type GetBlocksByHash = {
  hash: string;
  getType: GetTypes.BlockHash;
};

type GetBlocksByRange = {
  from: number;
  to: number | undefined;
  getType: GetTypes.Range;
};

export const getBlocks = async ({
  from,
  to,
}: {
  from: number;
  to: number | undefined;
}): Promise<ChicmozL2Block[]> => {
  return _getBlocks({ from, to, getType: GetTypes.Range });
};

export const getBlock = async (
  heightOrHash: number | string
): Promise<ChicmozL2Block | null> => {
  const res = await _getBlocks(
    typeof heightOrHash === "number"
      ? { height: heightOrHash, getType: GetTypes.BlockHeight }
      : { hash: heightOrHash, getType: GetTypes.BlockHash }
  );
  if (res.length === 0) return null;
  return res[0];
};

type GetBlocksArgs = GetBlocksByHeight | GetBlocksByHash | GetBlocksByRange;

const _getBlocks = async (args: GetBlocksArgs): Promise<ChicmozL2Block[]> => {
  if (args.getType === GetTypes.Range) {
    const { from, to } = args;
    if (to) {
      if (from > to) throw new Error("Invalid range: from is greater than to");
      if (to - from > DB_MAX_BLOCKS)
        throw new Error("Invalid range: too many blocks requested");
    }
  }

  if (args.getType === GetTypes.BlockHeight)
    if (args.height < 0) throw new Error("Invalid height");

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

  let whereQuery;

  switch (args.getType) {
    case GetTypes.BlockHeight:
      whereQuery = joinQuery
        .where(eq(l2Block.height, args.height))
        .limit(1);
      break;
    case GetTypes.BlockHash:
      whereQuery = joinQuery
        .where(eq(l2Block.hash, args.hash))
        .limit(1);
      break;
    case GetTypes.Range:
      whereQuery = joinQuery
        .where(
          and(
            gte(l2Block.height, args.from),
            lt(l2Block.height, args.to ?? args.from + DB_MAX_BLOCKS)
          )
        )
        .orderBy(asc(l2Block.height));
      break;
  }

  const results = await whereQuery.execute();

  const blocks: ChicmozL2Block[] = [];

  for (const result of results) {
    const txEffectsData = await db()
      .select({
        txEffect: getTableColumns(txEffect),
      })
      .from(bodyToTxEffects)
      .innerJoin(txEffect, eq(bodyToTxEffects.txEffectId, txEffect.id))
      .where(eq(bodyToTxEffects.bodyId, result.bodyId))
      .orderBy(asc(txEffect.index))
      .execute();

    // TODO: might be better to do this async
    const txEffects = await Promise.all(
      txEffectsData.map(async (data) => {
        const nestedData = await getTxEffectNestedById(data.txEffect.id);
        return {
          ...data.txEffect,
          ...nestedData,
        };
      })
    );

    const blockData = {
      hash: result.hash,
      height: result.height,
      archive: {
        root: result.archiveRoot,
        nextAvailableLeafIndex: result.archiveNextAvailableLeafIndex,
      },
      header: {
        lastArchive: {
          root: result.headerLastArchiveRoot,
          nextAvailableLeafIndex:
            result.headerLastArchiveNextAvailableLeafIndex,
        },
        totalFees: result.headerTotalFees,
        contentCommitment: {
          numTxs: result.ccNumTxs,
          txsEffectsHash: result.ccTxsEffectsHash,
          inHash: result.ccInHash,
          outHash: result.ccOutHash,
        },
        state: {
          l1ToL2MessageTree: {
            root: result.stateL1ToL2MessageTreeRoot,
            nextAvailableLeafIndex:
              result.stateL1ToL2MessageTreeNextAvailableLeafIndex,
          },
          partial: {
            noteHashTree: {
              root: result.stateNoteHashTreeRoot,
              nextAvailableLeafIndex:
                result.stateNoteHashTreeNextAvailableLeafIndex,
            },
            nullifierTree: {
              root: result.stateNullifierTreeRoot,
              nextAvailableLeafIndex:
                result.stateNullifierTreeNextAvailableLeafIndex,
            },
            publicDataTree: {
              root: result.statePublicDataTreeRoot,
              nextAvailableLeafIndex:
                result.statePublicDataTreeNextAvailableLeafIndex,
            },
          },
        },
        globalVariables: {
          chainId: result.gvChainId,
          version: result.gvVersion,
          blockNumber: result.gvBlockNumber,
          slotNumber: result.gvSlotNumber,
          timestamp: result.gvTimestamp,
          coinbase: result.gvCoinbase,
          feeRecipient: result.gvFeeRecipient,
          gasFees: {
            feePerDaGas: result.gvGasFeesFeePerDaGas,
            feePerL2Gas: result.gvGasFeesFeePerL2Gas,
          },
        },
      },
      body: {
        txEffects: txEffects,
      },
    };

    blocks.push(
      await chicmozL2BlockSchema
        .parseAsync(blockData)
        .catch(dbParseErrorCallback)
    );
  }
  return blocks;
};
