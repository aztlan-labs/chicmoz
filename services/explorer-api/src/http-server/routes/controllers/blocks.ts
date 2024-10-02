import asyncHandler from "express-async-handler";
import { controllers as db } from "../../../database/index.js";
import {
  getBlockByHeightOrHashSchema,
  getBlocksSchema,
} from "../paths_and_validation.js";

export const GET_LATEST_HEIGHT = asyncHandler(async (_req, res) => {
  const latestBlock = await db.l2Block.getLatestBlock();
  if (latestBlock?.header.globalVariables.blockNumber)
    res.status(200).send(latestBlock.header.globalVariables.blockNumber);
  else throw new Error("Latest height not found");
});

export const GET_LATEST_BLOCK = asyncHandler(async (_req, res) => {
  const latestBlock = await db.l2Block.getLatestBlock();
  res.status(200).send(JSON.stringify(latestBlock));
});

export const GET_BLOCK = asyncHandler(async (req, res) => {
  const { heightOrHash } = getBlockByHeightOrHashSchema.parse(req).params;
  const block = await db.l2Block.getBlock(heightOrHash);
  if (!block) throw new Error("Block not found");
  res.status(200).send(JSON.stringify(block));
});

export const GET_BLOCKS = asyncHandler(async (req, res) => {
  const { from, to } = getBlocksSchema.parse(req).query;
  const blocks = await db.l2Block.getBlocks({ from, to });
  if (!blocks) throw new Error("Blocks not found");
  res.status(200).send(JSON.stringify(blocks));
});
