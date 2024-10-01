import {
  chicmozL2TxEffectSchema,
  type ChicmozL2TxEffect,
} from "@chicmoz-pkg/types";
import { z } from "zod";
import { aztecExplorer } from "~/service/constants";
import client, { validateResponse } from "./client";

export const TxEffectsAPI = {
  getTxEffectById: async (txId: string): Promise<ChicmozL2TxEffect> => {
    const response = await client.get(aztecExplorer.getL2TxEffectById, {
      params: {
        id: txId,
      },
    });
    return validateResponse(chicmozL2TxEffectSchema, response.data);
  },
  getTxEffectsByHeight: async (
    height: number,
  ): Promise<ChicmozL2TxEffect[]> => {
    const response = await client.get(
      aztecExplorer.getL2TxEffectsByHeight(height),
    );
    return validateResponse(z.array(chicmozL2TxEffectSchema), response.data);
  },
  getTxEffectByHeightAndIndex: async (
    height: number,
    index: number,
  ): Promise<number> => {
    const response = await client.get(
      aztecExplorer.getL2TxEffectByHeightAndIndex(height, index),
    );
    return validateResponse(z.number(), response.data);
  },
  getTxEffectsByHeightRange: async (
    start: number,
    end: number,
  ): Promise<number> => {
    const response = await client.get(
      aztecExplorer.getL2TxEffectsByHeightRange,
      {
        params: {
          start,
          end,
        },
      },
    );
    return validateResponse(z.number(), response.data);
  },
};
