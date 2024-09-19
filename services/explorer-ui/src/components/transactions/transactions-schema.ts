import { z } from "zod";

export type TransactionTableSchema = z.infer<typeof transactionSchema>;

const transactionSchema = z.object({
  transactionHash: z.string(),
  status: z.string(),
  block: z.number(),
  timestamp: z.string(),
  transactionFee: z.string(),
});
