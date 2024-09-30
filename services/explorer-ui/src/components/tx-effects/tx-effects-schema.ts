import { z } from "zod";

export type TxEffectsTableSchema = z.infer<typeof txEffectsSchema>;

const txEffectsSchema = z.object({
  txHash: z.string(),
  transactionFee: z.number(),
  logCount: z.number(),
});
