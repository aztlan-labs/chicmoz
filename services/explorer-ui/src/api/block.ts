import { type ChicmozL2Block, chicmozL2BlockSchema } from "@chicmoz-pkg/types";
import client, { validateResponse } from "./client";
import { aztecExplorer } from "~/service/constants";
import { z } from "zod";

export const BlockAPI = {
  getLatestBlock: async (): Promise<ChicmozL2Block> => {
    const response = await client.get(aztecExplorer.getL2LatestBlock);

    return validateResponse(chicmozL2BlockSchema, response.data);
  },
  getLatestHeight: async (): Promise<number> => {
    const response = await client.get(aztecExplorer.getL2LatestHeight);
    return validateResponse(z.number(), response.data);
  },
  getBlockByHeight: async (height: string): Promise<ChicmozL2Block> => {
    const response = await client.get(
      `${aztecExplorer.getL2BlockByHeight}${height}`
    );
    return validateResponse(chicmozL2BlockSchema, response.data);
  },
  getBlocksByHeightRange: async (
    start?: number,
    end?: number
  ): Promise<ChicmozL2Block[]> => {
    const params: { start?: number; end?: number } = {};
    if (start) params.start = start;
    if (end) params.end = end;
    const response = await client.get(
      `${aztecExplorer.getL2BlocksByHeightRange}`,
      {
        params,
      }
    );
    //return validateResponse(z.array(chicmozL2BlockSchema), response.data);
    const validResponse = validateResponse(z.array(chicmozL2BlockSchema), response.data);
    console.log(validResponse[0].header.globalVariables.timestamp);
    return validResponse;
  },
  getBlockByHash: async (hash: string): Promise<ChicmozL2Block> => {
    const response = await client.get(
      `${aztecExplorer.getL2BlockByHash}${hash}`
    );
    return validateResponse(chicmozL2BlockSchema, response.data);
  },
};
