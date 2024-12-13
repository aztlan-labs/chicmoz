import {
  chicmozL2VerifiedContractAddressDataSchema,
  type ChicmozL2VerifiedContractAddressData,
} from "@chicmoz-pkg/types";
import { aztecExplorer } from "~/service/constants";
import client, { validateResponse } from "./client";

export const VerifiedContractL2API = {
  getVerifiedContract: async (
    address: string
  ): Promise<ChicmozL2VerifiedContractAddressData> => {
    const response = await client.get(
      aztecExplorer.getL2VerifiedContractByInstanceAddress(address)
    );
    return validateResponse(
      chicmozL2VerifiedContractAddressDataSchema,
      response.data
    );
  },
  getVerifiedContracts: async (): Promise<
    ChicmozL2VerifiedContractAddressData[]
  > => {
    const response = await client.get(aztecExplorer.getL2VerifiedContracts);
    return validateResponse(
      chicmozL2VerifiedContractAddressDataSchema.array(),
      response.data
    );
  },
};
