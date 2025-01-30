import { z } from "zod";
import { frSchema } from "../aztec/utils.js";

export const l1L2BlockProposedSchema = z.object({
  l1BlockNumber: z.coerce.bigint(),
  l2BlockNumber: z.coerce.bigint(),
  archive: frSchema,
  blockTimestamp: z.number(),
});

export type L1L2BlockProposed = z.infer<typeof l1L2BlockProposedSchema>;

export const l1L2ProofVerifiedSchema = z.object({
  l1BlockNumber: z.coerce.bigint(),
  l2BlockNumber: z.coerce.bigint(),
  proverId: frSchema,
  blockTimestamp: z.number(),
});

export type L1L2ProofVerified = z.infer<typeof l1L2ProofVerifiedSchema>;
