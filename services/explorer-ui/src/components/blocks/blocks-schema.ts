import { z } from "zod";

export type BlockTableSchema = z.infer<typeof blockSchema>;

const frNumberSchema = z.preprocess((val) => {
  if (typeof val === "string") return parseInt(val, 16);
  return val;
}, z.coerce.number());

export const blockSchema = z.object({
  height: z.number(),
  blockHash: z.string(),
  numberOfTransactions: frNumberSchema,
  txEffectsLength: z.number(),
  totalFees: frNumberSchema,
  timestamp: frNumberSchema,
});
