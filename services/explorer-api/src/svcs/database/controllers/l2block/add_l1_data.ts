import { getDb as db } from "@chicmoz-pkg/postgres-helper";
import { L1L2BlockProposed, L1L2ProofVerified } from "@chicmoz-pkg/types";
import { eq } from "drizzle-orm";
import { QueryResult } from "pg";
import { l2Block } from "../../../database/schema/l2block/index.js";

export const addL1L2BlockProposed = async (
  proposedData: L1L2BlockProposed
): Promise<QueryResult> => {
  return await db()
    .update(l2Block)
    .set({
      proposedOnL1_blockNumber: proposedData.l1BlockNumber,
      proposedOnL1_timestamp: proposedData.blockTimestamp,
    })
    .where(eq(l2Block.height, proposedData.l2BlockNumber));
};

export const addL1L2ProofVerified = async (
  proofVerifiedData: L1L2ProofVerified
): Promise<QueryResult> => {
  return await db()
    .update(l2Block)
    .set({
      proofVerifiedOnL1_blockNumber: proofVerifiedData.l1BlockNumber,
      proofVerifiedOnL1_timestamp: proofVerifiedData.blockTimestamp,
      proofVerifiedOnL1_proverId: proofVerifiedData.proverId,
    })
    .where(eq(l2Block.height, proofVerifiedData.l2BlockNumber));
};
