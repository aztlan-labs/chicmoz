import { aztecExplorer } from "~/service/constants";
import client, { validateResponse } from "./client";
import { z } from "zod";

export const statusL2Api = {
  getL2TotalTxEffects: async (): Promise<string> => {
    const response = await client.get(aztecExplorer.getL2TotalTxEffects);
    return validateResponse(z.string(), response.data);
  },
  //TODO: define type for response object
  getL2TotalTxEffectsLast24h: async (): Promise<string> => {
    const response = await client.get(aztecExplorer.getL2TotalTxEffectsLast24h);
    const res = JSON.stringify(response.data);
    return validateResponse(z.string(), res);
  },
  //TODO: define schema for response object
  getL2TotalContracts: async (): Promise<string> => {
    const response = await client.get(aztecExplorer.getL2TotalContracts);
    const res = JSON.stringify(response.data);
    return validateResponse(z.string(), res);
  },
  getL2AverageFees: async (): Promise<string> => {
    const response = await client.get(aztecExplorer.getL2AverageFees);
    return validateResponse(z.string(), response.data);
  },
  getL2AverageBlockTime: async (): Promise<string> => {
    const response = await client.get(aztecExplorer.getL2AverageBlockTime);
    return validateResponse(z.string(), response.data);
  },
};
