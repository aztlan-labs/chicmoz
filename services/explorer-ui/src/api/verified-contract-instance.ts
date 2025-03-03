import {
  chicmozL2ContractInstanceDeployerMetadata,
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
      chicmozL2ContractInstanceDeployerMetadata,
      response.data
    );
  },
  getVerifiedContracts: async (): Promise<
    ChicmozL2VerifiedContractInctanceData[]
  > => {
    const response = await client.get(aztecExplorer.getL2VerifiedContracts);
    return validateResponse(
      chicmozL2ContractInstanceDeployerMetadata.array(),
      response.data
    );
  },
};
