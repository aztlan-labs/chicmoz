import {
  chicmozL1GenericContractEventSchema,
  type ChicmozL1GenericContractEvent,
} from "@chicmoz-pkg/types";
import { z } from "zod";
import { aztecExplorer } from "~/service/constants";
import client, { validateResponse } from "../client";

export const ContractEventAPI = {
  getContractEvents: async (): Promise<ChicmozL1GenericContractEvent[]> => {
    const response = await client.get(`${aztecExplorer.getL1GenericContractEvents}`);
    return validateResponse(z.array(chicmozL1GenericContractEventSchema), response.data);
  },
};
