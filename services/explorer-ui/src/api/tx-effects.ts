import { z } from "zod";
import { type ChicmozL2TxEffect, chicmozL2TxEffectSchema } from "@chicmoz-pkg/types";
import client, { validateResponse } from "./client";
import { aztecExplorer } from "~/service/constants";

export const TxEffectsAPI = {
  getTxEffectById: async (txId: string): Promise<ChicmozL2TxEffect> => {
    const response = await client.get(aztecExplorer.getL2TxEffectById, {
      params: {
        id: txId,
      },
    });
    return validateResponse(chicmozL2TxEffectSchema, response.data);
  },
  getTxEffectsByHeight: async (height: number): Promise<ChicmozL2TxEffect[]> => {
    const response = await client.get(
      aztecExplorer.getL2TxEffectsByHeight(height),
    );
    return validateResponse(z.array(chicmozL2TxEffectSchema), response.data);
  },
  getTxEffectByHeightAndIndex: async (
    height: number,
    index: number,
  ): Promise<ChicmozL2TxEffect> => {
    const response = await client.get(
      aztecExplorer.getL2TxEffectByHeightAndIndex(height, index),
    );
    return validateResponse(chicmozL2TxEffectSchema, response.data);
  },
  getTxEffectsByHeightRange: async (
    start: number,
    end: number,
  ): Promise<ChicmozL2TxEffect[]> => {
    const response = await client.get(
      aztecExplorer.getL2TxEffectsByHeightRange,
      {
        params: {
          start,
          end,
        },
      },
    );
    return validateResponse(z.array(chicmozL2TxEffectSchema), response.data);
  },
};
