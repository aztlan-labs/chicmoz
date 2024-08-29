// from aztec sdk https://github.com/AztecProtocol/aztec-connect-explorer/blob/master/src/block/types.ts

import { z } from "zod";

const txSchema = z.object({
  id: z.string(),
  proofId: z.number(),
  proofData: z.string(),
  offchainTxData: z.string(),
  newNote1: z.string(),
  newNote2: z.string(),
  nullifier1: z.string(),
  nullifier2: z.string(),
  publicInput: z.string(),
  publicOutput: z.string(),
  inputOwner: z.string(),
  outputOwner: z.string(),
});

export type Tx = z.infer<typeof txSchema>;

const dbTxSchema = txSchema.extend({
  blockId: z.number(),
});

export type DbTx = z.infer<typeof dbTxSchema>;

const blockSchema = z.object({
  id: z.number(),
  hash: z.string(),
  dataRoot: z.string(),
  txs: z.array(txSchema),
  proofData: z.optional(z.string()),
  nullifierRoot: z.optional(z.string()),
  ethTxHash: z.optional(z.string()),
  mined: z.date(),
  day: z.number(),
});

export type Block = z.infer<typeof blockSchema>;

const dbBlockSchema = blockSchema.extend({
  createdAt: z.string(),
});

export type DbBlock = z.infer<typeof dbBlockSchema>;

const blockQueryDataSchema = z.object({
  block: blockSchema,
});

export type BlockQueryData = z.infer<typeof blockQueryDataSchema>;

const blockQueryVarsSchema = z.object({
  id: z.number(),
});

export type BlockQueryVars = z.infer<typeof blockQueryVarsSchema>;
