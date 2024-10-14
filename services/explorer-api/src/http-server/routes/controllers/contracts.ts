import asyncHandler from "express-async-handler";
import { controllers as db } from "../../../database/index.js";
import {
  getContractClassSchema,
  getContractClassesByClassIdSchema,
  getContractInstanceSchema,
  getContractInstancesByBlockHashSchema,
  getContractInstancesByContractClassIdSchema,
  getContractInstancesSchema,
} from "../paths_and_validation.js";
import {
  contractClassResponse,
  contractClassResponseArray,
  contractInstanceResponse,
  contractInstanceResponseArray,
  dbWrapper,
} from "./utils/index.js";

export const openapi_GET_L2_REGISTERED_CONTRACT_CLASS = {
  "/l2/contract-classes/{classId}/versions/{version}": {
    get: {
      summary: "Get registered contract class by contract class id and version",
      parameters: [
        {
          name: "classId",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
        {
          name: "version",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: contractClassResponse,
    },
  },
};

export const GET_L2_REGISTERED_CONTRACT_CLASS = asyncHandler(async (req, res) => {
  const { classId, version } = getContractClassSchema.parse(req).params;
  const contractClass = await dbWrapper.get(
    ["l2", "contract-classes", classId],
    () => db.l2Contract.getL2RegisteredContractClass(classId, version)
  );
  res.status(200).send(contractClass);
});

export const openapi_GET_L2_REGISTERED_CONTRACT_CLASSES_ALL_VERSIONS = {
  "/l2/contract-classes/{classId}": {
    get: {
      summary: "Get all versions of registered contract classes by contract class id",
      parameters: [
        {
          name: "classId",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: contractClassResponseArray,
    },
  },
};

export const GET_L2_REGISTERED_CONTRACT_CLASSES_ALL_VERSIONS = asyncHandler(async (req, res) => {
  const { classId } = getContractClassesByClassIdSchema.parse(req).params;
  const contractClasses = await dbWrapper.getLatest(
    ["l2", "contract-classes", classId],
    () => db.l2Contract.getL2RegisteredContractClasses(classId)
  );
  res.status(200).send(contractClasses);
});

export const openapi_GET_L2_REGISTERED_CONTRACT_CLASSES = {
  "/l2/contract-classes": {
    get: {
      summary: "Get latest registered contract classes",
      responses: contractClassResponseArray,
    },
  },
};

export const GET_L2_REGISTERED_CONTRACT_CLASSES = asyncHandler(async (_req, res) => {
  const contractClasses = await dbWrapper.getLatest(
    ["l2", "contract-classes"],
    () => db.l2Contract.getL2RegisteredContractClasses()
  );
  res.status(200).send(contractClasses);
});

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
  const instances = await dbWrapper.getLatest(
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

export const openapi_GET_L2_CONTRACT_INSTANCES_BY_CONTRACT_CLASS_ID = {
  "/l2/contracts/class/{classId}": {
    get: {
      summary: "Get contract instances by contract class id",
      parameters: [
        {
          name: "classId",
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

export const GET_L2_CONTRACT_INSTANCES_BY_CONTRACT_CLASS_ID = asyncHandler(
  async (req, res) => {
    const { classId } = getContractInstancesByContractClassIdSchema.parse(req).params;
    const instances = await dbWrapper.getLatest(
      ["l2", "contracts", "class", classId],
      () => db.l2Contract.getL2DeployedContractInstancesByContractClassId(classId)
    );
    res.status(200).send(instances);
  }
);
