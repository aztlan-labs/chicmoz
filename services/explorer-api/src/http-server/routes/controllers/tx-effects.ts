import asyncHandler from "express-async-handler";
import { controllers as db } from "../../../database/index.js";
import {
  getTxEffectByBlockHeightAndIndexSchema,
  getTxEffectsByBlockHeightSchema,
  getTxEffectsByTxHashSchema,
} from "../paths_and_validation.js";

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
