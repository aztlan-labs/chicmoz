import { z } from "zod";

export type BlockTableSchema = z.infer<typeof blockSchema>;

const blockSchema = z.object({
  id: z.string(),
  blockHash: z.string(),
  status: z.string(),
  timestamp: z.number(),
  transactions: z.number(),
});

// TODO: update to use correct schema
// export const blockSchema = z.object({
//   id: z.number(),
//   hash: z.string(),
//   dataRoot: z.string(),
//   txs: z.array(txSchema),
//   proofData: z.optional(z.string()),
//   nullifierRoot: z.optional(z.string()),
//   ethTxHash: z.optional(z.string()),
//   mined: z.date(),
//   day: z.number(),
//   batched_height: z.number(),
// });
