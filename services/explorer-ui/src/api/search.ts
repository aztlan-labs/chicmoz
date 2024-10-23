import { aztecExplorer } from "~/service/constants";
import client, { validateResponse } from "./client";
import {
  type ChicmozSearchResults,
  chicmozSearchResultsSchema,
} from "@chicmoz-pkg/types";

export const searchL2Api = {
  search: async (query: string): Promise<ChicmozSearchResults> => {
    const response = await client.get(aztecExplorer.getL2SearchResult, {
      params: { q: query },
    });
    return validateResponse(chicmozSearchResultsSchema, response.data);
  },
};
