import asyncHandler from "express-async-handler";
import { controllers as db } from "../../../database/index.js";
import {
  getTxEffectByBlockHeightAndIndexSchema,
  getTxEffectsByBlockHeightSchema,
  getTxEffectsByTxHashSchema,
} from "../paths_and_validation.js";
import {
  dbWrapper,
  txEffectResponse,
  txEffectResponseArray,
} from "./utils/index.js";

export const openapi_GET_L2_TX_EFFECTS_BY_BLOCK_HEIGHT = {
  "/l2/blocks/{blockHeight}/txEffects": {
    get: {
      summary: "Get transaction effects by block height",
      parameters: [
        {
          name: "blockHeight",
          in: "path",
          required: true,
          schema: {
            type: "integer",
          },
        },
      ],
      responses: txEffectResponseArray,
    },
  },
};

export const GET_L2_TX_EFFECTS_BY_BLOCK_HEIGHT = asyncHandler(
  async (req, res) => {
    const { blockHeight } = getTxEffectsByBlockHeightSchema.parse(req).params;
    const txEffectsData = await dbWrapper.get(
      ["l2", "blocks", blockHeight, "txEffects"],
      () => db.l2TxEffect.getTxEffectsByBlockHeight(blockHeight)
    );
    res.status(200).send(txEffectsData);
  }
);

export const openapi_GET_L2_TX_EFFECT_BY_BLOCK_HEIGHT_AND_INDEX = {
  "/l2/blocks/{blockHeight}/txEffects/{txEffectIndex}": {
    get: {
      summary: "Get a specific transaction effect by block height and index",
      parameters: [
        {
          name: "blockHeight",
          in: "path",
          required: true,
          schema: {
            type: "integer",
          },
        },
        {
          name: "txEffectIndex",
          in: "path",
          required: true,
          schema: {
            type: "integer",
          },
        },
      ],
      responses: txEffectResponse,
    },
  },
};

export const GET_L2_TX_EFFECT_BY_BLOCK_HEIGHT_AND_INDEX = asyncHandler(
  async (req, res) => {
    const { blockHeight, txEffectIndex } =
      getTxEffectByBlockHeightAndIndexSchema.parse(req).params;
    const txEffectsData = await dbWrapper.get(
      ["l2", "blocks", blockHeight, "txEffects", txEffectIndex],
      () =>
        db.l2TxEffect.getTxEffectByBlockHeightAndIndex(
          blockHeight,
          txEffectIndex
        )
    );
    res.status(200).send(txEffectsData);
  }
);

export const openapi_GET_L2_TX_EFFECT_BY_TX_HASH = {
  "/l2/txEffects/{txHash}": {
    get: {
      summary: "Get transaction effects by transaction hash",
      parameters: [
        {
          name: "txHash",
          in: "path",
          required: true,
          schema: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]+$",
          },
        },
      ],
      responses: txEffectResponse,
    },
  },
};

export const GET_L2_TX_EFFECT_BY_TX_HASH = asyncHandler(async (req, res) => {
  const { txHash } = getTxEffectsByTxHashSchema.parse(req).params;
  const txEffectsData = await dbWrapper.get(["l2", "txEffects", txHash], () =>
    db.l2TxEffect.getTxeffectByTxHash(txHash)
  );
  res.status(200).send(txEffectsData);
});
