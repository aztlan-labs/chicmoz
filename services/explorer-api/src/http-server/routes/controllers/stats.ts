import asyncHandler from "express-async-handler";
import { controllers as db } from "../../../database/index.js";

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
