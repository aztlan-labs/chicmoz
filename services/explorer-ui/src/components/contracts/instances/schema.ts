import { z } from "zod";

export type ContractInstancesTableSchema = z.infer<typeof contractInstancesSchema>;

export const contractInstancesSchema = z.object({
  address: z.string(),
  blockHash: z.string(),
  blockHeight: z.number().optional(),
  version: z.number(),
  contractClassId: z.string(),
  publicKeysHash: z.string(),
  deployer: z.string(),
});
