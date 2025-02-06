import {
  chicmozFeeRecipientSchema,
  type ChicmozFeeRecipient,
} from "@chicmoz-pkg/types";
import { aztecExplorer } from "~/service/constants";
import client, { validateResponse } from "./client";

export const FeeRecipientAPI = {
  getBlockByHeight: async (): Promise<ChicmozFeeRecipient> => {
    const response = await client.get(`${aztecExplorer.getL2FeeRecipients}`);
    return validateResponse(chicmozFeeRecipientSchema, response.data);
  },
};
