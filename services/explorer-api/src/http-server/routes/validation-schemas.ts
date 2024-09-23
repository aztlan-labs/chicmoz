import { hexStringSchema } from "@chicmoz-pkg/types";
import { z } from "zod";

export const getBlockByHeightOrHashSchema = z.object({
  params: z.object({
    heightOrHash: z.string(),
  }),
});

export const getBlocksSchema = z.object({
  query: z.object({
    from: z.coerce.number(),
    to: z.coerce.number().optional(),
  }),
});

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

export const getTxEffectsByTxHashSchema = z.object({
  params: z.object({
    txHash: hexStringSchema,
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
