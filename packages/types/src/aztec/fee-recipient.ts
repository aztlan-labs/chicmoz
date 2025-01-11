import { z } from "zod";
import { aztecAddressSchema } from "../index.js";

export const chicmozFeeRecipientSchema = z.object({
  l2Address: aztecAddressSchema,
  feesReceived: z.coerce.bigint(),
  nbrOfBlocks: z.number(),
  calculatedForNumberOfBlocks: z.number(),
  partOfTotalFeesReceived: z.number().optional(),
});

export type ChicmozFeeRecipient = z.infer<typeof chicmozFeeRecipientSchema>;
