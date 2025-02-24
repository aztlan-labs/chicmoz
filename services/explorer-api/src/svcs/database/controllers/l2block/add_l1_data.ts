import { getDb as db } from "@chicmoz-pkg/postgres-helper";
import { ChicmozL1L2BlockProposed, ChicmozL1L2ProofVerified } from "@chicmoz-pkg/types";
import { QueryResult } from "pg";
import {
  l1L2BlockProposedTable,
  l1L2ProofVerifiedTable,
} from "../../schema/index.js";

export const addL1L2BlockProposed = async (
  proposedData: ChicmozL1L2BlockProposed
): Promise<QueryResult> => {
  return await db()
    .insert(l1L2BlockProposedTable)
    .values(proposedData)
    .onConflictDoNothing();
};

export const addL1L2ProofVerified = async (
  proofVerifiedData: ChicmozL1L2ProofVerified
): Promise<QueryResult> => {
  return await db()
    .insert(l1L2ProofVerifiedTable)
    .values(proofVerifiedData)
    .onConflictDoNothing();
};

// TODO: update finalization status to block
// TODO: update finalization status to block (proof verified)
