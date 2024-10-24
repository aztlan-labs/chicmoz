import {
  chicmozL2TxEffectDeluxeSchema,
  type ChicmozL2TxEffectDeluxe,
} from "@chicmoz-pkg/types";
import { z } from "zod";
import { aztecExplorer } from "~/service/constants";
import client, { validateResponse } from "./client";

export const TxEffectsAPI = {
  getTxEffectByHash: async (hash: string): Promise<ChicmozL2TxEffectDeluxe> => {
    const response = await client.get(
      `${aztecExplorer.getL2TxEffectByHash}/${hash}`,
    );
    return validateResponse(chicmozL2TxEffectDeluxeSchema, response.data);
  },
  getTxEffectsByBlockHeight: async (
    height: number,
  ): Promise<ChicmozL2TxEffectDeluxe[]> => {
    const response = await client.get(
      aztecExplorer.getL2TxEffectsByHeight(height),
    );
    return validateResponse(z.array(chicmozL2TxEffectDeluxeSchema), response.data);
  },
  getTxEffectByBlockHeightAndIndex: async (
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
