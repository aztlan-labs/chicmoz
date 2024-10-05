import {
  type ChicmozL2ContractInstanceDeluxe,
  chicmozL2ContractInstanceDeluxeSchema,
} from "@chicmoz-pkg/types";
import client, { validateResponse } from "./client";
import { aztecExplorer } from "~/service/constants";

export const ContractL2API = {
  getContracInstance: async (
    address: string,
  ): Promise<ChicmozL2ContractInstanceDeluxe> => {
    const response = await client.get(
      `${aztecExplorer.getL2ContractInstance}${address}`,
    );
    return validateResponse(
      chicmozL2ContractInstanceDeluxeSchema,
      response.data,
    );
  },
  getContractInstances: async (): Promise<ChicmozL2ContractInstanceDeluxe[]> => {
    const response = await client.get(aztecExplorer.getL2ContractInstances);
    return validateResponse(
      chicmozL2ContractInstanceDeluxeSchema.array(),
      response.data,
    );
  },
  getContracInstanceByBlockHash: async (
    blockHash: string,
  ): Promise<ChicmozL2ContractInstanceDeluxe> => {
    const response = await client.get(
      `${aztecExplorer.getL2ContractInstancesByBlockHash(blockHash)}`,
    );
    return validateResponse(
      chicmozL2ContractInstanceDeluxeSchema,
      response.data,
    );
  },
};
