import { z } from "zod";
import {frNumberSchema} from "~/lib/utils";

export type TxEffectTableSchema = z.infer<typeof txEffectSchema>;

export const txEffectSchema = z.object({
  txHash: z.string(),
  transactionFee: z.number(),
  logCount: z.number(),
  blockNumber: z.number(),
  timestamp: frNumberSchema,
});
