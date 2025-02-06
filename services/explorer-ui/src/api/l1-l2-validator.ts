import {
  chicmozL1L2ValidatorSchema,
  type ChicmozL1L2Validator,
} from "@chicmoz-pkg/types";
import { z } from "zod";
import { aztecExplorer } from "~/service/constants";
import client, { validateResponse } from "./client";

export const L1L2ValidatorAPI = {
  getValidators: async (): Promise<ChicmozL1L2Validator[]> => {
    const response = await client.get(aztecExplorer.getL1L2Validators);
    return validateResponse(z.array(chicmozL1L2ValidatorSchema), response.data);
  },
  getValidatorByAddress: async (
    address: string
  ): Promise<ChicmozL1L2Validator> => {
    const response = await client.get(aztecExplorer.getL1L2Validator(address));
    return validateResponse(chicmozL1L2ValidatorSchema, response.data);
  },
  getValidatorHistory: async (
    address: string
  ): Promise<ChicmozL1L2Validator[]> => {
    const response = await client.get(
      aztecExplorer.getL1L2ValidatorHistory(address)
    );
    return validateResponse(z.array(chicmozL1L2ValidatorSchema), response.data);
  },
};
