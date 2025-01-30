import { ethAddressSchema } from "../general.js";
import { z } from "zod";
export * from "./contract-events.js";

// NOTE: explaination copied from aztec-packages: l1-contracts/src/core/interfaces/IStaking.sol
// None -> Does not exist in our setup
// Validating -> Participating as validator
// Living -> Not participating as validator, but have funds in setup,
// 			 hit if slashes and going below the minimum
// Exiting -> In the process of exiting the system
export enum L1L2ValidatorStatus {
  NONE,
  VALIDATING,
  LIVING,
  EXITING,
}

export const chicmozL1L2ValidatorSchema = z.object({
  attester: ethAddressSchema,
  stake: z.coerce.bigint().nonnegative(), // TODO: this is not Fr but it might as well be. It is a uint256
  withdrawer: ethAddressSchema,
  proposer: ethAddressSchema,
  status: z.nativeEnum(L1L2ValidatorStatus),
  // NOTE: we could use createdAt and updatedAt, but I want to emphasize that this is the first time we saw this validator. It can be way off from the actual creation time (on chain).
  firstSeenAt: z.coerce.date().default(() => new Date()),
  latestSeenChangeAt: z.coerce.date().default(() => new Date()),
});

export type ChicmozL1L2Validator = z.infer<typeof chicmozL1L2ValidatorSchema>;

const timestampSchema = z.coerce.date();
const keyChangedSchema = z.coerce.string();
const newValueSchema = z.coerce.string();

export const chicmozL1L2ValidatorHistoryEntrySchema = z.tuple([
  timestampSchema,
  keyChangedSchema,
  newValueSchema,
]);

export type ChicmozL1L2ValidatorHistoryEntry = z.infer<
  typeof chicmozL1L2ValidatorHistoryEntrySchema
>;

export const chicmozL1L2ValidatorHistorySchema = z.array(
  chicmozL1L2ValidatorHistoryEntrySchema
);

export type ChicmozL1L2ValidatorHistory = z.infer<
  typeof chicmozL1L2ValidatorHistorySchema
>;
