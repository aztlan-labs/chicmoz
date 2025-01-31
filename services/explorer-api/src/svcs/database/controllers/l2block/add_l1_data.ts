import { getDb as db } from "@chicmoz-pkg/postgres-helper";
import { L1L2BlockProposed, L1L2ProofVerified } from "@chicmoz-pkg/types";
import { QueryResult } from "pg";
import {
  l1L2BlockProposedTable,
  l1L2ProofVerifiedTable,
} from "../../schema/index.js";

export const addL1L2BlockProposed = async (
  proposedData: L1L2BlockProposed
): Promise<QueryResult> => {
  return await db().insert(l1L2BlockProposedTable).values(proposedData);
};

export const addL1L2ProofVerified = async (
  proofVerifiedData: L1L2ProofVerified
): Promise<QueryResult> => {
  return await db().insert(l1L2ProofVerifiedTable).values(proofVerifiedData);
};
