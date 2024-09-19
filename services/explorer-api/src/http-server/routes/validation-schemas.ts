import { hexStringSchema } from "@chicmoz-pkg/types";
import { z } from "zod";

export const getTransactionByBlockHeightAndIndexSchema = z.object({
  params: z.object({
blockHeight: z.coerce.number(),
txIndex: z.coerce.number(),
  }),
});

export const getContractInstanceSchema = z.object({
  params: z.object({
    address: hexStringSchema,
  }),
});

export const getContractInstancesByBlockHashSchema = z.object({
  params: z.object({
    blockHash: hexStringSchema,
  }),
});
