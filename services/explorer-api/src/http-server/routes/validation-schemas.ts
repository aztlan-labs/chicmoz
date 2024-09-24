import { hexStringSchema } from "@chicmoz-pkg/types";
import { z } from "zod";

export const getTxEffectsByBlockHeightSchema = z.object({
  params: z.object({
    blockHeight: z.coerce.number(),
  }),
});

export const getTxEffectByBlockHeightAndIndexSchema = z.object({
  params: z.object({
    blockHeight: z.coerce.number(),
    txEffectIndex: z.coerce.number(),
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
