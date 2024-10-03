import asyncHandler from "express-async-handler";
import { controllers as db } from "../../../database/index.js";
import {
  getBlockByHeightOrHashSchema,
  getBlocksSchema,
} from "../paths_and_validation.js";
import {blockResponse, blockResponseArray} from "./utils.js";

export const openapi_GET_LATEST_HEIGHT = {
  "/l2/latest-height": {
    get: {
      summary: "Get the latest block height",
      responses: {
        "200": {
          description: "Successful response",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  height: {
                    type: "integer",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const GET_LATEST_HEIGHT = asyncHandler(async (_req, res) => {
  const latestBlock = await db.l2Block.getLatestBlock();
  if (latestBlock?.header.globalVariables.blockNumber)
    res.status(200).send(latestBlock.header.globalVariables.blockNumber);
  else throw new Error("Latest height not found");
});

export const openapi_GET_LATEST_BLOCK = {
  "/l2/blocks/latest": {
    get: {
      summary: "Get the latest block",
      responses: blockResponse,
    },
  },
};

export const GET_LATEST_BLOCK = asyncHandler(async (_req, res) => {
  const latestBlock = await db.l2Block.getLatestBlock();
  res.status(200).send(JSON.stringify(latestBlock));
});

export const openapi_GET_BLOCK = {
  "/l2/blocks/{heightOrHash}": {
    get: {
      summary: "Get a block by height or hash",
      parameters: [
        {
          name: "heightOrHash",
          in: "path",
          required: true,
          schema: {
            oneOf: [
              {
                type: "string",
                pattern: "^0x[a-fA-F0-9]+$",
              },
              {
                type: "integer",
              },
            ],
          },
        },
      ],
      responses: blockResponse,
    },
  },
};

export const GET_BLOCK = asyncHandler(async (req, res) => {
  const { heightOrHash } = getBlockByHeightOrHashSchema.parse(req).params;
  const block = await db.l2Block.getBlock(heightOrHash);
  if (!block) throw new Error("Block not found");
  res.status(200).send(JSON.stringify(block));
});

export const openapi_GET_BLOCKS = {
  "/l2/blocks": {
    get: {
      summary: "Get multiple blocks",
      parameters: [
        {
          name: "from",
          in: "query",
          schema: {
            type: "integer",
          },
        },
        {
          name: "to",
          in: "query",
          schema: {
            type: "integer",
          },
        },
      ],
      responses: blockResponseArray,
    },
  },
};

export const GET_BLOCKS = asyncHandler(async (req, res) => {
  const { from, to } = getBlocksSchema.parse(req).query;
  const blocks = await db.l2Block.getBlocks({ from, to });
  if (!blocks) throw new Error("Blocks not found");
  res.status(200).send(JSON.stringify(blocks));
});
