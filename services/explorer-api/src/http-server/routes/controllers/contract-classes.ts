import {
  getContractClassFromArtifact,
  loadContractArtifact,
  type NoirCompiledContract,
} from "@aztec/aztec.js";
import asyncHandler from "express-async-handler";
import { controllers as db } from "../../../database/index.js";
import {
  getContractClassesByClassIdSchema,
  getContractClassSchema,
  postContrctClassArtifactSchema,
} from "../paths_and_validation.js";
import {
  contractClassResponse,
  contractClassResponseArray,
  dbWrapper,
} from "./utils/index.js";
import { chicmozL2ContractClassRegisteredEventSchema } from "@chicmoz-pkg/types";

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

export const GET_L2_REGISTERED_CONTRACT_CLASS = asyncHandler(
  async (req, res) => {
    const { classId, version } = getContractClassSchema.parse(req).params;
    const contractClass = await dbWrapper.get(
      ["l2", "contract-classes", classId, version],
      () => db.l2Contract.getL2RegisteredContractClass(classId, version)
    );
    res.status(200).send(contractClass);
  }
);

export const openapi_GET_L2_REGISTERED_CONTRACT_CLASSES_ALL_VERSIONS = {
  "/l2/contract-classes/{classId}": {
    get: {
      summary:
        "Get all versions of registered contract classes by contract class id",
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

export const GET_L2_REGISTERED_CONTRACT_CLASSES_ALL_VERSIONS = asyncHandler(
  async (req, res) => {
    const { classId } = getContractClassesByClassIdSchema.parse(req).params;
    const contractClasses = await dbWrapper.getLatest(
      ["l2", "contract-classes", classId],
      () => db.l2Contract.getL2RegisteredContractClasses(classId)
    );
    res.status(200).send(contractClasses);
  }
);

export const openapi_GET_L2_REGISTERED_CONTRACT_CLASSES = {
  "/l2/contract-classes": {
    get: {
      summary: "Get latest registered contract classes",
      responses: contractClassResponseArray,
    },
  },
};

export const GET_L2_REGISTERED_CONTRACT_CLASSES = asyncHandler(
  async (_req, res) => {
    const contractClasses = await dbWrapper.getLatest(
      ["l2", "contract-classes"],
      () => db.l2Contract.getL2RegisteredContractClasses()
    );
    res.status(200).send(contractClasses);
  }
);

export const openapi_POST_L2_REGISTERED_CONTRACT_CLASS_ARTIFACT = {
  "/l2/contract-classes/{classId}/versions/{version}/artifact": {
    post: {
      summary: "Register and verify contract class artifact",
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
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                stringifiedArtifactJson: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      // TODO: add response schema
      responses: contractClassResponse,
    },
  },
};

export const POST_L2_REGISTERED_CONTRACT_CLASS_ARTIFACT = asyncHandler(
  async (req, res) => {
    const {
      params: { classId, version },
      body: { stringifiedArtifactJson },
    } = postContrctClassArtifactSchema.parse(req);
    const contractClassString = await dbWrapper.get(
      ["l2", "contract-classes", classId, version],
      () => db.l2Contract.getL2RegisteredContractClass(classId, version)
    );
    const contractClass = chicmozL2ContractClassRegisteredEventSchema.parse(
      JSON.parse(contractClassString)
    );
    const uploadedArtifact = getContractClassFromArtifact(
      loadContractArtifact(JSON.parse(stringifiedArtifactJson) as unknown as NoirCompiledContract)
    );
    const isMatchingByteCode = uploadedArtifact.packedBytecode.equals(
      contractClass.packedBytecode
    );
    if (!isMatchingByteCode) throw new Error("Incorrect artifact");
    const completeContractClass = {
      ...contractClass,
      artifactJson: stringifiedArtifactJson,
    };
    await db.l2Contract.addArtifactJson(contractClass.contractClassId, contractClass.version, stringifiedArtifactJson);
    res.status(200).send(completeContractClass);
  }
);
