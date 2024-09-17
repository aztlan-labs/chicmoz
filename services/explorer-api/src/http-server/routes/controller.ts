import asyncHandler from "express-async-handler";
import { controllers as db } from "../../database/index.js";
import {getContractInstanceSchema} from "./validation-schemas.js";

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
  const { heightOrHash } = req.params;
  const block = await db.l2Block.getBlock(heightOrHash);
  if (!block) throw new Error("Block not found");
  res.status(200).send(JSON.stringify(block));
});

export const GET_HEALTH = asyncHandler((_req, res) => {
  // TODO: evaluate actual health checks
  //   - db
  //   - message bus
  res.sendStatus(200);
});

export const GET_L2_CONTRACT_INSTANCE = asyncHandler(async (req, res) => {
  const { address } = getContractInstanceSchema.parse(req).params;
  const instance = await db.l2Contract.getL2DeployedContractInstance(address);
  if (!instance) throw new Error("Contract instance not found");
  res.status(200).send(JSON.stringify(instance));
});
