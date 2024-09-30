import { z } from "zod";
import client, { validateResponse } from "./client";
import { aztecExplorer } from "~/service/constants";

export const TxEffectsAPI = {
  getTxEffectById: async (txId: string): Promise<number> => {
    const response = await client.get(aztecExplorer.getL2TxEffectById, {
      params: {
        id: txId,
      },
    });
    return validateResponse(z.number(), response.data);
  },
  getTxEffectsByHeight: async (height: number): Promise<number> => {
    const response = await client.get(
      aztecExplorer.getL2TxEffectsByHeight(height),
    );
    return validateResponse(z.number(), response.data);
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
