import { aztecExplorer } from "~/service/constants";
import client, { validateResponse } from "./client";
import {
  type ChicmozSearchResults,
  chicmozSearchResultsSchema,
  chicmozSearchQuerySchema,
} from "@chicmoz-pkg/types";

export const searchL2Api = {
  search: async (queryString: string): Promise<ChicmozSearchResults> => {
    const query = chicmozSearchQuerySchema.parse({ q: queryString });
    const response = await client.get(aztecExplorer.getL2SearchResult, {
      params: query,
    });
    return validateResponse(chicmozSearchResultsSchema, response.data);
  },
};
