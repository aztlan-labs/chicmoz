import { z } from "zod";

export type BlockTableSchema = z.infer<typeof blockSchema>;

export const blockSchema = z.object({
  height: z.coerce.number(),
  blockHash: z.string(),
  txEffectsLength: z.number(),
  totalFees: z.coerce.string(),
  totalManaUsed: z.coerce.string(),
  timestamp: z.number(),
});
