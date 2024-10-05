import asyncHandler from "express-async-handler";
import { controllers as db } from "../../../database/index.js";
import {
  getContractInstanceSchema,
  getContractInstancesByBlockHashSchema,
  getContractInstancesSchema,
} from "../paths_and_validation.js";
import {
  contractInstanceResponse,
  contractInstanceResponseArray,
  dbWrapper,
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
  const instanceData = await dbWrapper.get(
    ["l2", "contracts", address],
    () => db.l2Contract.getL2DeployedContractInstanceByAddress(address)
  );
  res.status(200).send(instanceData);
});

export const openapi_GET_L2_CONTRACT_INSTANCES = {
  "/l2/contracts": {
    get: {
      summary: "Get contract instances between from and to block heights",
      parameters: [
        {
          name: "fromHeight",
          in: "query",
          schema: {
            type: "integer",
          },
        },
        {
          name: "toHeight",
          in: "query",
          schema: {
            type: "integer",
          },
        },
      ],
      responses: contractInstanceResponseArray,
    },
  },
};

export const GET_L2_CONTRACT_INSTANCES = asyncHandler(async (req, res) => {
  const { fromHeight, toHeight } = getContractInstancesSchema.parse(req).query;
  const instances = await dbWrapper.get(
    ["l2", "contracts", fromHeight, toHeight],
    () =>
      db.l2Contract.getL2DeployedContractInstances({
        fromHeight,
        toHeight
      })
  );
  res.status(200).send(instances);
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
    const instances = await dbWrapper.get(
      ["l2", "contracts", "block", blockHash],
      () =>
        db.l2Contract.getL2DeployedContractInstancesByBlockHash(blockHash)
    );
    res.status(200).send(instances);
  }
);
