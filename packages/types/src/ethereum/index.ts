import { ethAddressSchema } from "../general.js";
import { z } from "zod";

// NOTE: explaination copied from aztec-packages: l1-contracts/src/core/interfaces/IStaking.sol
// None -> Does not exist in our setup
// Validating -> Participating as validator
// Living -> Not participating as validator, but have funds in setup,
// 			 hit if slashes and going below the minimum
// Exiting -> In the process of exiting the system
export enum Status {
  NONE,
  VALIDATING,
  LIVING,
  EXITING
}

export const chicmozL1L2ValidatorSchema = z.object({
  attester: ethAddressSchema,
  stake: z.coerce.bigint().nonnegative(),
  withdrawer: ethAddressSchema,
  proposer: ethAddressSchema,
  status: z.nativeEnum(Status),
  // NOTE: we could use createdAt and updatedAt, but I want to emphasize that this is the first time we saw this validator. It can be way off from the actual creation time (on chain).
  firstSeenAt: z.date().default(() => new Date()),
  latestSeenChangeAt: z.date().default(() => new Date())
});

export type ChicmozL1L2Validator = z.infer<typeof chicmozL1L2ValidatorSchema>;
