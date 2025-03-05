import { ChicmozL2BlockFinalizationUpdateEvent } from "@chicmoz-pkg/message-registry";
import { getDb as db } from "@chicmoz-pkg/postgres-helper";
import {
  ChicmozL1L2BlockProposed,
  ChicmozL1L2ProofVerified,
  ChicmozL2Block,
  ChicmozL2BlockFinalizationStatus,
} from "@chicmoz-pkg/types";
import { and, eq } from "drizzle-orm";
import { logger } from "../../../../logger.js";
import {
  archive,
  l1L2BlockProposedTable,
  l1L2ProofVerifiedTable,
  l2Block,
} from "../../schema/index.js";
import { l2BlockFinalizationStatusTable } from "../../schema/l2block/finalization-status.js";

export const addL1L2BlockProposed = async (
  proposedData: ChicmozL1L2BlockProposed,
): Promise<ChicmozL2BlockFinalizationUpdateEvent | null> => {
  await db()
    .insert(l1L2BlockProposedTable)
    .values(proposedData)
    .onConflictDoUpdate({
      target: [
        l1L2BlockProposedTable.l2BlockNumber,
        l1L2BlockProposedTable.archive,
      ],
      set: {
        isFinalized: proposedData.isFinalized,
      },
    });

  const l2BlockHashRes = await db()
    .select({
      l2BlockHash: l2Block.hash,
    })
    .from(l2Block)
    .innerJoin(archive, eq(l2Block.hash, archive.fk))
    .where(eq(l2Block.height, proposedData.l2BlockNumber))
    .limit(1);
  const l2BlockHash = l2BlockHashRes?.[0]?.l2BlockHash;
  if (!l2BlockHash) {
    logger.debug(
      `addL1L2BlockProposed: L2 block ${proposedData.l2BlockNumber} not found, might not yet be stored, skipping...`,
    );
    return null;
  }

  const status = proposedData.isFinalized
    ? ChicmozL2BlockFinalizationStatus.L1_MINED_PROPOSED
    : ChicmozL2BlockFinalizationStatus.L1_SEEN_PROPOSED;

  await db()
    .insert(l2BlockFinalizationStatusTable)
    .values({
      l2BlockHash,
      l2BlockNumber: proposedData.l2BlockNumber,
      status,
    })
    .onConflictDoNothing();
  return {
    l2BlockHash,
    status,
  };
};

export const ensureFinalizationStatusStored = async (
  l2BlockHash: ChicmozL2Block["hash"],
  l2BlockNumber: ChicmozL2Block["height"],
  archiveRoot: string,
): Promise<ChicmozL2BlockFinalizationUpdateEvent | null> => {
  const proposedData = await db()
    .select({
      isFinalized: l1L2BlockProposedTable.isFinalized,
    })
    .from(l1L2BlockProposedTable)
    .where(
      and(
        eq(l1L2BlockProposedTable.l2BlockNumber, l2BlockNumber),
        eq(l1L2BlockProposedTable.archive, archiveRoot),
      ),
    )
    .limit(1);
  if (proposedData.length === 0) {
    logger.debug(
      `ensureFinalizationStatusStored: L2 block ${l2BlockNumber} not found in proposed table, skipping...`,
    );
    return null;
  }
  let status = proposedData[0].isFinalized
    ? ChicmozL2BlockFinalizationStatus.L1_MINED_PROPOSED
    : ChicmozL2BlockFinalizationStatus.L1_SEEN_PROPOSED;
  await db()
    .insert(l2BlockFinalizationStatusTable)
    .values({
      l2BlockHash,
      l2BlockNumber,
      status,
    })
    .onConflictDoNothing();

  const verifiedData = await db()
    .select({
      isFinalized: l1L2ProofVerifiedTable.isFinalized,
    })
    .from(l1L2ProofVerifiedTable)
    .innerJoin(
      l1L2BlockProposedTable,
      eq(
        l1L2ProofVerifiedTable.l1BlockHash,
        l1L2BlockProposedTable.l1BlockHash,
      ),
    )
    .innerJoin(archive, eq(l1L2BlockProposedTable.archive, archive.root))
    .where(and(eq(l1L2ProofVerifiedTable.l2BlockNumber, l2BlockNumber)))
    .limit(1);

  if (verifiedData.length === 0) {
    logger.debug(
      `ensureFinalizationStatusStored: L2 block ${l2BlockNumber} not found in verified table, skipping...`,
    );
    return null;
  }

  status = verifiedData[0].isFinalized
    ? ChicmozL2BlockFinalizationStatus.L1_MINED_PROVEN
    : ChicmozL2BlockFinalizationStatus.L1_SEEN_PROVEN;

  await db()
    .insert(l2BlockFinalizationStatusTable)
    .values({
      l2BlockHash,
      l2BlockNumber,
      status,
    })
    .onConflictDoNothing();

  return {
    l2BlockHash,
    status,
  };
};

export const addL1L2ProofVerified = async (
  proofVerifiedData: ChicmozL1L2ProofVerified,
): Promise<ChicmozL2BlockFinalizationUpdateEvent | null> => {
  // TODO: db-transaction
  await db()
    .insert(l1L2ProofVerifiedTable)
    .values(proofVerifiedData)
    .onConflictDoUpdate({
      target: [
        l1L2ProofVerifiedTable.l2BlockNumber,
        l1L2ProofVerifiedTable.proverId,
      ],
      set: {
        isFinalized: proofVerifiedData.isFinalized,
      },
    })

  const l2BlockHashResSimple = await db()
    .select({
      l2BlockHash: l2Block.hash,
    })
    .from(l2Block)
    .where(eq(l2Block.height, proofVerifiedData.l2BlockNumber));
  let l2BlockHash;

  if (l2BlockHashResSimple.length === 0) {
    logger.debug(
      `addL1L2ProofVerified: L2 block ${proofVerifiedData.l2BlockNumber} not found, might not yet be stored, skipping...`,
    );
    return null;
  } else if (l2BlockHashResSimple.length === 1) {
    l2BlockHash = l2BlockHashResSimple[0].l2BlockHash;
  } else {
    const l2BlockHashRes = await db()
      .select({
        l2BlockHash: l2Block.hash,
      })
      .from(l2Block)
      .innerJoin(
        l1L2BlockProposedTable,
        eq(l2Block.height, l1L2BlockProposedTable.l2BlockNumber),
      )
      .innerJoin(archive, eq(l2Block.hash, archive.fk))
      .where(
        and(
          eq(l1L2BlockProposedTable.l1BlockHash, proofVerifiedData.l1BlockHash),
          eq(l1L2BlockProposedTable.archive, archive.root),
        ),
      )
      .limit(1);
    l2BlockHash = l2BlockHashRes?.[0]?.l2BlockHash;
    logger.warn(
      `Multiple L2 blocks found for L1L2ProofVerified ${proofVerifiedData.l2BlockNumber} guessing on block hash "${l2BlockHash}"`,
    );
  }

  const status = proofVerifiedData.isFinalized
    ? ChicmozL2BlockFinalizationStatus.L1_MINED_PROVEN
    : ChicmozL2BlockFinalizationStatus.L1_SEEN_PROVEN;
  await db().insert(l2BlockFinalizationStatusTable).values({
    l2BlockHash,
    l2BlockNumber: proofVerifiedData.l2BlockNumber,
    status,
  })
  .onConflictDoNothing();
  return {
    l2BlockHash,
    status,
  };
};
