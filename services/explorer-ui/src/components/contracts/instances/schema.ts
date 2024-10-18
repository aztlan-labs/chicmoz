import { z } from "zod";

export type ContractInstance = z.infer<typeof contractInstanceSchema>;

export const contractInstanceSchema = z.object({
  address: z.string(),
  blockHash: z.string(),
  blockHeight: z.number().optional(),
  version: z.number(),
  contractClassId: z.string(),
  publicKeysHash: z.string(),
  deployer: z.string(),
});
