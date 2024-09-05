import type { Fr as FrType, L2Block } from "@aztec/aztec.js";
import { asc, desc, eq, getTableColumns } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../logger.js";
import { getDb as db } from "../index.js";
import {
  archive,
  body,
  bodyToTxEffects,
  contentCommitment,
  globalVariables,
  header,
  l2Block,
  state,
  txEffect as txEffectTable,
} from "../schema/index.js";

export const getLatest = async () => {
  logger.info(`Getting latest block...`);
  const res = await db()
    .select({
      hash: l2Block.hash,
      archiveRoot: archive.root,
      archiveNextAvailableLeafIndex: archive.nextAvailableLeafIndex,
      headerLastArchive: header.lastArchive,
      headerTotalFees: header.totalFees,
      ccNumTxs: contentCommitment.numTxs,
      ccTxsEffectsHash: contentCommitment.txsEffectsHash,
      ccInHash: contentCommitment.inHash,
      ccOutHash: contentCommitment.outHash,
      stateL1ToL2MessageTree: state.l1ToL2MessageTree,
      statePartial: state.partial,
      gvChainId: globalVariables.chainId,
      gvVersion: globalVariables.version,
      gvBlockNumber: globalVariables.blockNumber,
      gvSlotNumber: globalVariables.slotNumber,
      gvTimestamp: globalVariables.timestamp,
      gvCoinbase: globalVariables.coinbase,
      gvFeeRecipient: globalVariables.feeRecipient,
      gvGasFees: globalVariables.gasFees,
      bodyId: body.id,
    })
    .from(l2Block)
    .innerJoin(archive, eq(l2Block.archiveId, archive.id))
    .innerJoin(header, eq(l2Block.headerId, header.id))
    .innerJoin(body, eq(l2Block.bodyId, body.id))
    .innerJoin(
      contentCommitment,
      eq(header.contentCommitmentId, contentCommitment.id)
    )
    .innerJoin(state, eq(header.stateId, state.id))
    .innerJoin(
      globalVariables,
      eq(header.globalVariablesId, globalVariables.id)
    )
    .orderBy(desc(globalVariables.blockNumber))
    .limit(1)
    .execute();

  if (res.length === 0) return null;

  const block = res[0];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { index, ...txEffectColumns } = getTableColumns(txEffectTable);

  // NOTE: Fetch txEffects separately to avoid a potentially large join
  const txEffects = await db()
    .select(txEffectColumns)
    .from(txEffectTable)
    .innerJoin(
      bodyToTxEffects,
      eq(txEffectTable.id, bodyToTxEffects.txEffectId)
    )
    .where(eq(bodyToTxEffects.bodyId, block.bodyId))
    .orderBy(asc(txEffectTable.index))
    .execute();

  return {
    hash: block.hash,
    archive: {
      root: block.archiveRoot,
      nextAvailableLeafIndex: block.archiveNextAvailableLeafIndex,
    },
    header: {
      lastArchive: block.headerLastArchive,
      totalFees: block.headerTotalFees,
      contentCommitment: {
        numTxs: block.ccNumTxs,
        txsEffectsHash: block.ccTxsEffectsHash,
        inHash: block.ccInHash,
        outHash: block.ccOutHash,
      },
      state: {
        l1ToL2MessageTree: block.stateL1ToL2MessageTree,
        partial: block.statePartial,
      },
      globalVariables: {
        chainId: block.gvChainId,
        version: block.gvVersion,
        blockNumber: block.gvBlockNumber,
        slotNumber: block.gvSlotNumber,
        timestamp: block.gvTimestamp,
        coinbase: block.gvCoinbase,
        feeRecipient: block.gvFeeRecipient,
        gasFees: block.gvGasFees,
      },
    },
    body: {
      txEffects: txEffects,
    },
  };
};

declare module "@aztec/aztec.js" {
  const Fr: {
    fromString(val: string): FrType;
  };
  interface Fr {
    toString(): string;
  }
  interface L2Block {
    hash(): Fr;
  }
}

const frValue = (f: FrType): string => f.toString();

export const store = async (block: L2Block) => {
  const hash = block?.hash()?.toString();
  logger.info(`📦 Storing block ${block.number} hash: ${hash}`);
  if (!hash) throw new Error(`Block ${block.number} could not find hash`);

  return await db().transaction(async (tx) => {
    const archiveId = uuidv4();
    const headerId = uuidv4();
    const bodyId = uuidv4();
    const contentCommitmentId = uuidv4();
    const stateId = uuidv4();
    const globalVariablesId = uuidv4();

    // Insert archive
    await tx
      .insert(archive)
      .values({
        id: archiveId,
        root: frValue(block.archive.root as FrType),
        nextAvailableLeafIndex: block.archive.nextAvailableLeafIndex,
      })
      .onConflictDoNothing();

    // Insert content commitment
    await tx
      .insert(contentCommitment)
      .values({
        id: contentCommitmentId,
        numTxs: frValue(block.header.contentCommitment.numTxs as FrType),
        txsEffectsHash: block.header.contentCommitment.txsEffectsHash,
        inHash: block.header.contentCommitment.inHash,
        outHash: block.header.contentCommitment.outHash,
      })
      .onConflictDoNothing();

    // Insert state
    await tx
      .insert(state)
      .values({
        id: stateId,
        l1ToL2MessageTree: block.header.state.l1ToL2MessageTree,
        partial: block.header.state.partial,
      })
      .onConflictDoNothing();

    // Insert global variables
    await tx
      .insert(globalVariables)
      .values({
        id: globalVariablesId,
        chainId: frValue(block.header.globalVariables.chainId as FrType),
        version: frValue(block.header.globalVariables.version as FrType),
        blockNumber: frValue(block.header.globalVariables.blockNumber as FrType),
        slotNumber: frValue(block.header.globalVariables.slotNumber as FrType),
        timestamp: frValue(block.header.globalVariables.timestamp as FrType),
        coinbase: block.header.globalVariables.coinbase as string,
        feeRecipient: block.header.globalVariables.feeRecipient as string,
        gasFees: block.header.globalVariables.gasFees,
      })
      .onConflictDoNothing();

    // Insert header
    await tx
      .insert(header)
      .values({
        id: headerId,
        lastArchive: block.header.lastArchive,
        contentCommitmentId,
        stateId,
        globalVariablesId,
        totalFees: frValue(block.header.totalFees as FrType),
      })
      .onConflictDoNothing();

    // Insert body
    await tx
      .insert(body)
      .values({
        id: bodyId,
      })
      .onConflictDoNothing();

    // Insert txEffects and create junction entries
    for (const [i, txEffect] of Object.entries(block.body.txEffects)) {
      if (isNaN(Number(i))) throw new Error("Invalid txEffect index");
      const txEffectId = uuidv4();
      await tx
        .insert(txEffectTable)
        .values({
          id: txEffectId,
          index: Number(i),
          revertCode: txEffect.revertCode,
          transactionFee: frValue(txEffect.transactionFee as FrType),
          noteHashes: txEffect.noteHashes,
          nullifiers: txEffect.nullifiers,
          l2ToL1Msgs: txEffect.l2ToL1Msgs,
          publicDataWrites: txEffect.publicDataWrites,
          noteEncryptedLogsLength: frValue(txEffect.noteEncryptedLogsLength as FrType),
          encryptedLogsLength: frValue(txEffect.encryptedLogsLength as FrType),
          unencryptedLogsLength: frValue(txEffect.unencryptedLogsLength as FrType),
          noteEncryptedLogs: txEffect.noteEncryptedLogs,
          encryptedLogs: txEffect.encryptedLogs,
          unencryptedLogs: txEffect.unencryptedLogs,
        })
        .onConflictDoNothing();

      // Create junction entry
      await tx
        .insert(bodyToTxEffects)
        .values({
          bodyId: bodyId,
          txEffectId: txEffectId,
        })
        .onConflictDoNothing();
    }

    // Insert l2Block
    await tx
      .insert(l2Block)
      .values({
        hash,
        archiveId,
        headerId,
        bodyId,
      })
      .onConflictDoNothing();

    return hash;
  });
};

export const block = {
  getLatest,
  store,
};
