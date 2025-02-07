import { z } from "zod";
import { frSchema } from "../aztec/utils.js";

export const l1L2BlockProposedSchema = z.object({
  // TODO: add Chicmoz to name
  // TODO: add address key
  l2BlockNumber: z.coerce.bigint(),
  l1BlockNumber: z.coerce.bigint(),
  l1BlockTimestamp: z.number(),
  archive: frSchema,
});

export type L1L2BlockProposed = z.infer<typeof l1L2BlockProposedSchema>;

export const l1L2ProofVerifiedSchema = z.object({
  // TODO: add Chicmoz to name
  // TODO: add address key
  l2BlockNumber: z.coerce.bigint(),
  l1BlockNumber: z.coerce.bigint(),
  l1BlockTimestamp: z.number(),
  proverId: frSchema,
});

export type L1L2ProofVerified = z.infer<typeof l1L2ProofVerifiedSchema>;

export const chicmozL1GenericContractEventSchema = z.object({
  eventName: z.string(),
  // TODO: does some events have bigints in args?
  eventArgs: z.record(z.unknown()).optional(),
  l1BlockNumber: z.coerce.bigint(),
  l1BlockHash: z.string().startsWith("0x"),
  l1BlockTimestamp: z.number(),
  l1ContractAddress: z.string(),
  l1TransactionHash: z.string().startsWith("0x").optional(),
});

export type ChicmozL1GenericContractEvent = z.infer<
  typeof chicmozL1GenericContractEventSchema
>;
