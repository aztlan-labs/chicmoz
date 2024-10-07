import { z } from "zod";
import { frNumberSchema } from "~/lib/utils";

export type BlockTableSchema = z.infer<typeof blockSchema>;

export const blockSchema = z.object({
  height: z.number(),
  blockHash: z.string(),
  numberOfTransactions: frNumberSchema,
  txEffectsLength: z.number(),
  totalFees: frNumberSchema,
  timestamp: frNumberSchema,
});
