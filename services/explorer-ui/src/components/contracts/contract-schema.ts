import { z } from "zod";

export type ContractTableSchema = z.infer<typeof contractSchema>;

export const contractSchema = z.object({
  address: z.string(),
  blockHash: z.string(),
  blockHeight: z.number(),
  version: z.number(),
  contractClassId: z.number(),
  publicKeysHash: z.number(),
  deployer: z.string(),
});
