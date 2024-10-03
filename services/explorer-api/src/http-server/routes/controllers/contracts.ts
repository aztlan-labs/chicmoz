import asyncHandler from "express-async-handler";
import { controllers as db } from "../../../database/index.js";
import {
  getContractInstanceSchema,
  getContractInstancesByBlockHashSchema,
} from "../paths_and_validation.js";
import {
  contractInstanceResponse,
  contractInstanceResponseArray,
} from "./utils/index.js";

export const openapi_GET_L2_CONTRACT_INSTANCE = {
  "/l2/contracts/{address}": {
    get: {
      summary: "Get contract instance by address",
      parameters: [
        {
          name: "address",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: contractInstanceResponse,
    },
  },
};

export const GET_L2_CONTRACT_INSTANCE = asyncHandler(async (req, res) => {
  const { address } = getContractInstanceSchema.parse(req).params;
  const instance =
    await db.l2Contract.getL2DeployedContractInstanceByAddress(address);
  if (!instance) throw new Error("Contract instance not found");
  res.status(200).send(JSON.stringify(instance));
});

export const openapi_GET_L2_CONTRACT_INSTANCES_BY_BLOCK_HASH = {
  "/l2/contracts/block/{blockHash}": {
    get: {
      summary: "Get contract instances by block hash",
      parameters: [
        {
          name: "blockHash",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: contractInstanceResponseArray,
    },
  },
};

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
