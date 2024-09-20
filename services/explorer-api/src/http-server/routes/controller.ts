import asyncHandler from "express-async-handler";
import { controllers as db } from "../../database/index.js";
import {
  getContractInstanceSchema,
  getContractInstancesByBlockHashSchema,
  getTransactionByBlockHeightAndIndexSchema,
  getTransactionsByBlockHeightSchema,
} from "./validation-schemas.js";

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

export const GET_L2_TRANSACTIONS_BY_BLOCK_HEIGHT = asyncHandler(
  async (req, res) => {
    const { blockHeight } =
      getTransactionsByBlockHeightSchema.parse(req).params;
    const transactions =
      await db.l2Transaction.getTransactionsByBlockHeight(blockHeight);
    if (!transactions) throw new Error("Transactions not found");
    res.status(200).send(JSON.stringify(transactions));
  }
);

export const GET_L2_TRANSACTION_BY_BLOCK_HEIGHT_AND_INDEX = asyncHandler(
  async (req, res) => {
    const { blockHeight, txIndex } =
      getTransactionByBlockHeightAndIndexSchema.parse(req).params;
    const transaction =
      await db.l2Transaction.getTransactionByBlockHeightAndIndex(
        blockHeight,
        txIndex
      );
    if (!transaction) throw new Error("Transaction not found");
    res.status(200).send(JSON.stringify(transaction));
  }
);

export const GET_L2_CONTRACT_INSTANCE = asyncHandler(async (req, res) => {
  const { address } = getContractInstanceSchema.parse(req).params;
  const instance =
    await db.l2Contract.getL2DeployedContractInstanceByAddress(address);
  if (!instance) throw new Error("Contract instance not found");
  res.status(200).send(JSON.stringify(instance));
});

export const GET_L2_CONTRACT_INSTANCES_BY_BLOCK_HASH = asyncHandler(
  async (req, res) => {
    const { blockHash } =
      getContractInstancesByBlockHashSchema.parse(req).params;
    const instances =
      await db.l2Contract.getL2DeployedContractInstancesByBlockHash(blockHash);
    if (!instances) throw new Error("Contract instances not found");
    res.status(200).send(JSON.stringify(instances));
  }
);
