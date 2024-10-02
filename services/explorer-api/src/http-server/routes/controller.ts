import asyncHandler from "express-async-handler";
import { controllers as db } from "../../database/index.js";
import {
  address,
  blockHash,
  blockHeight,
  getBlockByHeightOrHashSchema,
  getBlocksSchema,
  getContractInstanceSchema,
  getContractInstancesByBlockHashSchema,
  getTxEffectByBlockHeightAndIndexSchema,
  getTxEffectsByBlockHeightSchema,
  getTxEffectsByTxHashSchema,
  heightOrHash,
  routes,
  txEffectIndex,
  txHash,
} from "./routes_and_validation.js";

const SUB_PATH = "/v1/d1e2083a-660c-4314-a6f2-1d42f4b944f4";

export const GET_ROUTES = asyncHandler(async (_req, res) => {
  const block = await db.signOfLife.getABlock();
  const blockAndTxEffect = await db.signOfLife.getABlockWithTxEffects();
  const blockAndAContractInstance =
    await db.signOfLife.getABlockWithContractInstances();
  const r = [routes.latestHeight, routes.latestBlock, `${routes.blocks}?from=0`];

  if (block) {
    r.push(routes.block.replace(`:${heightOrHash}`, block.height.toString()));
    r.push(routes.block.replace(`:${heightOrHash}`, block.hash));
  } else {
    r.push(routes.block + "NOT FOUND");
  }

  if (blockAndTxEffect) {
    r.push(
      routes.txEffectsByBlockHeight.replace(
        `:${blockHeight}`,
        blockAndTxEffect.block.height.toString()
      )
    );
    r.push(
      routes.txEffectByBlockHeightAndIndex
        .replace(`:${blockHeight}`, blockAndTxEffect.block.height.toString())
        .replace(
          `:${txEffectIndex}`,
          blockAndTxEffect.txEffects[0].index.toString()
        )
    );
    r.push(
      routes.txEffectsByTxHash.replace(
        `:${txHash}`,
        blockAndTxEffect.txEffects[0].txHash
      )
    );
  } else {
    r.push(routes.txEffectsByBlockHeight + "NOT FOUND");
    r.push(routes.txEffectByBlockHeightAndIndex + "NOT FOUND");
    r.push(routes.txEffectsByTxHash + "NOT FOUND");
  }

  if (blockAndAContractInstance) {
    r.push(
      routes.contractInstancesByBlockHash.replace(
        `:${blockHash}`,
        blockAndAContractInstance.block.hash
      )
    );
    r.push(
      routes.contractInstance.replace(
        `:${address}`,
        blockAndAContractInstance.contractInstance.address
      )
    );
  } else {
    r.push(routes.contractInstancesByBlockHash + "NOT FOUND");
    r.push(routes.contractInstance + "NOT FOUND");
  }

  const statsRoutes = [
    routes.statsTotalTxEffects,
    routes.statsTotalTxEffectsLast24h,
    routes.statsTotalContracts,
    routes.statsAverageFees,
    routes.statsAverageBlockTime,
  ];

  const html = `
  <html>
    <head>
      <title>CHICMOZ API ROUTES</title>
    </head>
    <body>
      <ul>
        ${r.map((route) => `<li><a href=${SUB_PATH + route}>${route}</a></li>`).join("")}
      </ul>
      <br>
      <ul>
        ${statsRoutes.map((route) => `<li><a href=${SUB_PATH + route}>${route}</a></li>`).join("")}
    </body>
  </html>
  `;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  res.send(html);
});

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

export const GET_STATS_TOTAL_TX_EFFECTS = asyncHandler(async (_req, res) => {
  const total = await db.l2TxEffect.getTotalTxEffects();
  if (!total) throw new Error("Total tx effects not found");
  res.status(200).send(JSON.stringify(total));
});

export const GET_STATS_TOTAL_TX_EFFECTS_LAST_24H = asyncHandler((_req, res) => {
  const txEffects = db.l2TxEffect.getTotalTxEffectsLast24h();
  if (!txEffects) throw new Error("Tx effects not found");
  res.status(200).send(JSON.stringify(txEffects));
});

export const GET_STATS_TOTAL_CONTRACTS = asyncHandler(async (_req, res) => {
  const total = await db.l2Contract.getTotalContracts();
  if (!total) throw new Error("Total contracts not found");
  res.status(200).send(JSON.stringify(total));
});

export const GET_STATS_AVERAGE_FEES = asyncHandler(async (_req, res) => {
  const average = await db.l2Block.getAverageFees();
  if (!average) throw new Error("Average fees not found");
  res.status(200).send(JSON.stringify(average));
});

export const GET_STATS_AVERAGE_BLOCK_TIME = asyncHandler(async (_req, res) => {
  const average = await db.l2Block.getAverageBlockTime();
  if (!average) throw new Error("Average block time not found");
  res.status(200).send(JSON.stringify(average));
});
