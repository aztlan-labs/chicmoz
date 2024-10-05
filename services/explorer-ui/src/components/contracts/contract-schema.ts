import { z } from "zod";

export type ContractTableSchema = z.infer<typeof contractSchema>;

export const contractSchema = z.object({
  address: z.string(),
  blockHash: z.string(),
  blockHeight: z.number().optional(),
  version: z.number(),
  contractClassId: z.string(),
  publicKeysHash: z.string(),
  deployer: z.string(),
});
