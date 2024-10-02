import asyncHandler from "express-async-handler";
import { controllers as db } from "../../../database/index.js";
import {
  getContractInstanceSchema,
  getContractInstancesByBlockHashSchema,
} from "../paths_and_validation.js";

export * from "./inofficial.js";
export * from "./blocks.js";
export * from "./tx-effects.js";
export * from "./contracts.js";

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
