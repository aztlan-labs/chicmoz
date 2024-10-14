import asyncHandler from "express-async-handler";
import {getSearchSchema} from "../paths_and_validation.js";
import {
  searchResultResponse,
} from "./utils/index.js";

export const openapi_SEARCH = {
  "l2/search": {
    get: {
      summary: "Search for blocks, txEffects, contract classes and contract instances on Aztec",
      parameters: [
        {
          name: "q",
          in: "query",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: searchResultResponse
    },
  },
};

// eslint-disable-next-line @typescript-eslint/require-await
export const L2_SEARCH = asyncHandler(async (req, res) => {
  const { q } = getSearchSchema.parse(req).query;
  //const searchResults = await db.l2.search(q);
  const searchResults = {q};
  res.status(200).send(searchResults);
});
