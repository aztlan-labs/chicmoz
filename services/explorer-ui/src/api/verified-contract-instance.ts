import {
  chicmozL2VerifiedContractInstanceDataSchema,
  type ChicmozL2VerifiedContractInctanceData,
} from "@chicmoz-pkg/types";
import { aztecExplorer } from "~/service/constants";
import client, { validateResponse } from "./client";

export const VerifiedContractInstanceL2API = {
  getVerifiedContract: async (
    address: string
  ): Promise<ChicmozL2VerifiedContractInctanceData> => {
    const response = await client.get(
      aztecExplorer.getL2VerifiedContractByInstanceAddress(address)
    );
    return validateResponse(
      chicmozL2VerifiedContractInstanceDataSchema,
      response.data
    );
  },
  getVerifiedContracts: async (): Promise<
    ChicmozL2VerifiedContractInctanceData[]
  > => {
    const response = await client.get(aztecExplorer.getL2VerifiedContracts);
    return validateResponse(
      chicmozL2VerifiedContractInstanceDataSchema.array(),
      response.data
    );
  },
};
