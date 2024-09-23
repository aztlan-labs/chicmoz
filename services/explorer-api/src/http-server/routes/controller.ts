import asyncHandler from "express-async-handler";
import { controllers as db } from "../../database/index.js";
import {
  getBlockByHeightOrHashSchema,
  getBlocksSchema,
  getContractInstanceSchema,
  getContractInstancesByBlockHashSchema,
  getTxEffectByBlockHeightAndIndexSchema,
  getTxEffectsByBlockHeightSchema,
  getTxEffectsByTxHashSchema,
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

export const GET_HEALTH = asyncHandler((_req, res) => {
  // TODO: evaluate actual health checks
  //   - db
  //   - message bus
  res.sendStatus(200);
});

export const GET_L2_TX_EFFECTS_BY_BLOCK_HEIGHT = asyncHandler(
  async (req, res) => {
    const { blockHeight } = getTxEffectsByBlockHeightSchema.parse(req).params;
    const txEffects =
      await db.l2TxEffect.getTxEffectsByBlockHeight(blockHeight);
    if (!txEffects) throw new Error("TxEffects not found");
    res.status(200).send(JSON.stringify(txEffects));
  }
);

export const GET_L2_TX_EFFECT_BY_BLOCK_HEIGHT_AND_INDEX = asyncHandler(
  async (req, res) => {
    const { blockHeight, txEffectIndex } =
      getTxEffectByBlockHeightAndIndexSchema.parse(req).params;
    const txEffect = await db.l2TxEffect.getTxEffectByBlockHeightAndIndex(
      blockHeight,
      txEffectIndex
    );
    if (!txEffect) throw new Error("TxEffect not found");
    res.status(200).send(JSON.stringify(txEffect));
  }
);

export const GET_L2_TX_EFFECT_BY_TX_HASH = asyncHandler(async (req, res) => {
  const { txHash } = getTxEffectsByTxHashSchema.parse(req).params;
  const txEffects = await db.l2TxEffect.getTxeffectByTxHash(txHash);
  if (!txEffects) throw new Error("TxEffects not found");
  res.status(200).send(JSON.stringify(txEffects));
});

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
