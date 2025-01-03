import {
  ChicmozL2BlockLight,
  HexString,
  chicmozL2BlockLightSchema,
} from "@chicmoz-pkg/types";
import { asc, desc, eq } from "drizzle-orm";
import { getDb as db } from "../../../database/index.js";
import {
  archive,
  body,
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
import { DB_MAX_BLOCKS } from "../../../environment.js";
import { getBlocksWhereRange, getTableColumnsWithoutId } from "../utils.js";

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
  hash: HexString;
  getType: GetTypes.BlockHash;
};

type GetBlocksByRange = {
  from: number | undefined;
  to: number | undefined;
  getType: GetTypes.Range;
};

export const getBlocks = async ({
  from,
  to,
}: {
  from: number | undefined;
  to: number | undefined;
}): Promise<ChicmozL2BlockLight[]> => {
  return _getBlocks({ from, to, getType: GetTypes.Range });
};

export const getBlock = async (
  heightOrHash: number | HexString
): Promise<ChicmozL2BlockLight | null> => {
  const res = await _getBlocks(
    typeof heightOrHash === "number"
      ? { height: heightOrHash, getType: GetTypes.BlockHeight }
      : { hash: heightOrHash, getType: GetTypes.BlockHash }
  );
  if (res.length === 0) return null;
  return res[0];
};

type GetBlocksArgs = GetBlocksByHeight | GetBlocksByHash | GetBlocksByRange;

const _getBlocks = async (args: GetBlocksArgs): Promise<ChicmozL2BlockLight[]> => {
  const whereRange =
    args.getType === GetTypes.Range ? getBlocksWhereRange(args) : undefined;

  if (args.getType === GetTypes.BlockHeight)
    if (args.height < -1) throw new Error("Invalid height");

  const joinQuery = db()
    .select({
      hash: l2Block.hash,
      height: l2Block.height,
      archive: getTableColumnsWithoutId(archive),
      header_LastArchive: getTableColumnsWithoutId(lastArchive),
      header_TotalFees: header.totalFees,
      header_ContentCommitment: getTableColumnsWithoutId(contentCommitment),
      header_State_L1ToL2MessageTree: getTableColumnsWithoutId(l1ToL2MessageTree),
      header_State_Partial_NoteHashTree: getTableColumnsWithoutId(noteHashTree),
      header_State_Partial_NullifierTree: getTableColumnsWithoutId(nullifierTree),
      headerState_Partial_PublicDataTree: getTableColumnsWithoutId(publicDataTree),
      header_GlobalVariables: getTableColumnsWithoutId(globalVariables),
      header_GlobalVariables_GasFees: getTableColumnsWithoutId(gasFees),
      bodyId: body.id,
    })
    .from(l2Block)
    .innerJoin(archive, eq(l2Block.hash, archive.fk))
    .innerJoin(header, eq(l2Block.hash, header.blockHash))
    .innerJoin(lastArchive, eq(header.id, lastArchive.fk))
    .innerJoin(
      contentCommitment,
      eq(header.id, contentCommitment.headerId)
    )
    .innerJoin(state, eq(header.id, state.headerId))
    .innerJoin(
      l1ToL2MessageTree,
      eq(state.id, l1ToL2MessageTree.fk)
    )
    .innerJoin(partial, eq(state.id, partial.stateId))
    .innerJoin(noteHashTree, eq(partial.id, noteHashTree.fk))
    .innerJoin(nullifierTree, eq(partial.id, nullifierTree.fk))
    .innerJoin(publicDataTree, eq(partial.id, publicDataTree.fk))
    .innerJoin(
      globalVariables,
      eq(header.id, globalVariables.headerId)
    )
    .innerJoin(gasFees, eq(globalVariables.id, gasFees.globalVariablesId))
    .innerJoin(body, eq(l2Block.hash, body.blockHash));

  let whereQuery;

  switch (args.getType) {
    case GetTypes.BlockHeight:
      whereQuery =
        args.height === -1
          ? joinQuery.orderBy(desc(l2Block.height)).limit(1)
          : joinQuery.where(eq(l2Block.height, args.height)).limit(1);
      break;
    case GetTypes.BlockHash:
      whereQuery = joinQuery.where(eq(l2Block.hash, args.hash)).limit(1);
      break;
    case GetTypes.Range:
      whereQuery = joinQuery
        .where(whereRange)
        .orderBy(desc(l2Block.height))
        .limit(DB_MAX_BLOCKS);
      break;
  }

  const results = await whereQuery.execute();

  const blocks: ChicmozL2BlockLight[] = [];

  for (const result of results) {
    const txEffectsHashes = await db()
      .select({
        hash: txEffect.hash,
      })
      .from(txEffect)
      .where(eq(txEffect.bodyId, result.bodyId))
      .orderBy(asc(txEffect.index))
      .execute();

    const blockData = {
      hash: result.hash,
      height: result.height,
      archive: result.archive,
      header: {
        lastArchive: result.header_LastArchive,
        totalFees: result.header_TotalFees,
        contentCommitment: result.header_ContentCommitment,
        state: {
          l1ToL2MessageTree: result.header_State_L1ToL2MessageTree,
          partial: {
            noteHashTree: result.header_State_Partial_NoteHashTree,
            nullifierTree: result.header_State_Partial_NullifierTree,
            publicDataTree: result.headerState_Partial_PublicDataTree,
          },
        },
        globalVariables: {
          ...result.header_GlobalVariables,
          gasFees: result.header_GlobalVariables_GasFees,
        },
      },
      body: {
        txEffects: txEffectsHashes,
      },
    };

    blocks.push(await chicmozL2BlockLightSchema.parseAsync(blockData));
  }
  return blocks;
};
