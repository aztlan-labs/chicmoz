import { z } from "zod";
import { frSchema } from "../aztec/utils.js";

export const l1L2BlockProposedSchema = z.object({
  l2BlockNumber: z.coerce.bigint(),
  l1BlockNumber: z.coerce.bigint(),
  l1BlockTimestamp: z.number(),
  archive: frSchema,
});

export type L1L2BlockProposed = z.infer<typeof l1L2BlockProposedSchema>;

export const l1L2ProofVerifiedSchema = z.object({
  l2BlockNumber: z.coerce.bigint(),
  l1BlockNumber: z.coerce.bigint(),
  l1BlockTimestamp: z.number(),
  proverId: frSchema,
});

export type L1L2ProofVerified = z.infer<typeof l1L2ProofVerifiedSchema>;
