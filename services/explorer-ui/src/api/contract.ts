import {
  chicmozL2ContractClassRegisteredEventSchema,
  chicmozL2ContractInstanceDeluxeSchema,
  type ChicmozL2ContractClassRegisteredEvent,
  type ChicmozL2ContractInstanceDeluxe,
} from "@chicmoz-pkg/types";
import { aztecExplorer } from "~/service/constants";
import client, { validateResponse } from "./client";

export const ContractL2API = {
  getContractClass: async (
    address: string,
    version: string
  ): Promise<ChicmozL2ContractClassRegisteredEvent> => {
    const response = await client.get(
      aztecExplorer.getL2ContractClassByIdAndVersion(address, version)
    );
    return validateResponse(
      chicmozL2ContractClassRegisteredEventSchema,
      response.data
    );
  },
  getContractClasses: async (
    classId?: string
  ): Promise<ChicmozL2ContractClassRegisteredEvent[]> => {
    const response = await client.get(
      aztecExplorer.getL2ContractClasses(classId)
    );
    return validateResponse(
      chicmozL2ContractClassRegisteredEventSchema.array(),
      response.data
    );
  },
  getContractInstance: async (
    address: string
  ): Promise<ChicmozL2ContractInstanceDeluxe> => {
    const response = await client.get(
      aztecExplorer.getL2ContractInstance(address)
    );
    return validateResponse(
      chicmozL2ContractInstanceDeluxeSchema,
      response.data
    );
  },
  getContractInstances: async (): Promise<
    ChicmozL2ContractInstanceDeluxe[]
  > => {
    const response = await client.get(aztecExplorer.getL2ContractInstances);
    return validateResponse(
      chicmozL2ContractInstanceDeluxeSchema.array(),
      response.data
    );
  },
  getContracInstanceByBlockHash: async (
    blockHash: string
  ): Promise<ChicmozL2ContractInstanceDeluxe> => {
    const response = await client.get(
      aztecExplorer.getL2ContractInstancesByBlockHash(blockHash)
    );
    return validateResponse(
      chicmozL2ContractInstanceDeluxeSchema,
      response.data
    );
  },
  getContractInstancesByClassId: async (
    classId: string
  ): Promise<ChicmozL2ContractInstanceDeluxe[]> => {
    const response = await client.get(
      aztecExplorer.getL2ContractInstancesByClassId(classId)
    );
    return validateResponse(
      chicmozL2ContractInstanceDeluxeSchema.array(),
      response.data
    );
  },
};
