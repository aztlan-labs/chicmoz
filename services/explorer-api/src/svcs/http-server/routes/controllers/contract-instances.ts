import { NoirCompiledContract, loadContractArtifact } from "@aztec/aztec.js";
import {
  AztecAddress,
  Fr,
  PublicKeys,
  computeContractAddressFromInstance,
  computeInitializationHash,
  computeSaltedInitializationHash,
} from "@aztec/circuits.js";
import {
  generateVerifyArtifactPayload,
  verifyArtifactPayload,
} from "@chicmoz-pkg/contract-verification";
import { setEntry } from "@chicmoz-pkg/redis-helper";
import {
  chicmozL2ContractClassRegisteredEventSchema,
  chicmozL2ContractInstanceDeployedEventSchema,
} from "@chicmoz-pkg/types";
import asyncHandler from "express-async-handler";
import { CACHE_TTL_SECONDS } from "../../../../environment.js";
import { logger } from "../../../../logger.js";
import { controllers as db } from "../../../database/index.js";
import {
  getContractInstanceSchema,
  getContractInstancesByBlockHashSchema,
  getContractInstancesByContractClassIdSchema,
  getContractInstancesSchema,
  postVerifiedContractInstanceSchema,
} from "../paths_and_validation.js";
import {
  contractInstanceResponse,
  contractInstanceResponseArray,
  dbWrapper,
} from "./utils/index.js";

export const openapi_GET_L2_CONTRACT_INSTANCE = {
  "/l2/contract-instances/{address}": {
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
    ["l2", "contract-instances", address],
    () => db.l2Contract.getL2DeployedContractInstanceByAddress(address)
  );
  res.status(200).send(instanceData);
});

export const openapi_GET_L2_CONTRACT_INSTANCES = {
  "/l2/contract-instances/{address}": {
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
    ["l2", "contract-instances", fromHeight, toHeight],
    () =>
      db.l2Contract.getL2DeployedContractInstances({
        fromHeight,
        toHeight,
      })
  );
  res.status(200).send(instances);
});

export const openapi_GET_L2_CONTRACT_INSTANCES_BY_BLOCK_HASH = {
  "/l2/contract-instances/block/{blockHash}": {
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
      ["l2", "contract-instances", "block", blockHash],
      () => db.l2Contract.getL2DeployedContractInstancesByBlockHash(blockHash)
    );
    res.status(200).send(instances);
  }
);

export const openapi_GET_L2_CONTRACT_INSTANCES_BY_CONTRACT_CLASS_ID = {
  "/l2/contract-classes/{classId}/contract-instances": {
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
    const { classId } =
      getContractInstancesByContractClassIdSchema.parse(req).params;
    const instances = await dbWrapper.getLatest(
      ["l2", "contract-instances", "class", classId],
      () =>
        db.l2Contract.getL2DeployedContractInstancesByContractClassId(classId)
    );
    res.status(200).send(instances);
  }
);

export const openapi_POST_L2_VERIFY_CONTRACT_INSTANCE_DEPLOYMENT = {
  "/l2/contract-instances/{contractInstanceAddress}/verified-deployment": {
    get: {
      summary: "Post data to verify contract instance deployment",
      parameters: [
        {
          name: "contractInstanceAddress",
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

export const POST_L2_VERIFY_CONTRACT_INSTANCE_DEPLOYMENT = asyncHandler(
  async (req, res) => {
    const {
      params: { address },
      body: {
        stringifiedArtifactJson,
        publicKeys,
        salt,
        deployer,
        constructorArgs,
      },
    } = postVerifiedContractInstanceSchema.parse(req);
    const instanceData = await dbWrapper.get(
      ["l2", "contract-instances", address],
      () => db.l2Contract.getL2DeployedContractInstanceByAddress(address)
    );

    if (!instanceData || instanceData === undefined)
      res.status(404).send("Contract instance not found");

    const dbContractInstance =
      chicmozL2ContractInstanceDeployedEventSchema.parse(
        JSON.parse(instanceData!)
      );

    const pubkeySplit = Object.values(dbContractInstance.publicKeys).map(
      (key) => key.split("0x")[1]
    );
    const pubKeyString = "0x".concat(pubkeySplit.join(""));

    if (publicKeys && publicKeys !== pubKeyString) {
      res.status(400).send("Uploaded publicKeys do not match the DB");
      return;
    }

    if (salt && salt !== dbContractInstance.salt) {
      res.status(400).send("Uploaded salt does not match the DB");
      return;
    }

    if (deployer && deployer !== dbContractInstance.deployer) {
      res.status(400).send("Uploaded deployer does not match the DB");
      return;
    }
    const contractClassString = await dbWrapper.get(
      [
        "l2",
        "contract-classes",
        dbContractInstance.contractClassId,
        dbContractInstance.version,
      ],
      () =>
        db.l2Contract.getL2RegisteredContractClass(
          dbContractInstance.contractClassId,
          dbContractInstance.version
        )
    );
    const dbContractClass = chicmozL2ContractClassRegisteredEventSchema.parse(
      JSON.parse(contractClassString!)
    );
    if (!dbContractClass) {
      res.status(500).send("Contract class found in DB is not valid");
      return;
    }

    if (!stringifiedArtifactJson && !dbContractClass.artifactJson) {
      res
        .status(400)
        .send(
          `artifactJson is missing in the request and could not be found for contract class ${dbContractInstance.contractClassId} version ${dbContractInstance.version}`
        );
      return;
    }

    if (stringifiedArtifactJson && dbContractClass.artifactJson) {
      if (stringifiedArtifactJson !== dbContractClass.artifactJson) {
        res
          .status(400)
          .send(
            "Contract class already has a registered artifact that does not match the uploaded artifact"
          );
        return;
      }
    }

    let artifactString;
    if (stringifiedArtifactJson && !dbContractClass.artifactJson) {
      // TODO: this entire block should use verify contract class artifact
      const { isMatchingByteCode } = await verifyArtifactPayload(
        generateVerifyArtifactPayload(
          JSON.parse(stringifiedArtifactJson ?? "{}") as NoirCompiledContract
        ),
        dbContractClass
      );
      if (!isMatchingByteCode) {
        res.status(500).send("Uploaded artifact does not match contract class");
        return;
      }
      const completeContractClass = {
        ...dbContractClass,
        artifactJson: stringifiedArtifactJson,
      };

      setEntry(
        [
          "l2",
          "contract-classes",
          dbContractInstance.contractClassId,
          dbContractInstance.version,
        ],
        JSON.stringify(completeContractClass),
        CACHE_TTL_SECONDS
      ).catch((err) => {
        logger.warn(`Failed to cache contract class: ${err}`);
      });
      await db.l2Contract.addArtifactJson(
        dbContractClass.contractClassId,
        dbContractClass.version,
        stringifiedArtifactJson
      );
      artifactString = stringifiedArtifactJson;
    }

    if (!stringifiedArtifactJson && dbContractClass.artifactJson)
      artifactString = dbContractClass.artifactJson;

    if (!artifactString)
      throw new Error("For some reason artifactString is undefined");

    const artifact = loadContractArtifact(
      JSON.parse(artifactString) as unknown as NoirCompiledContract
    );

    const initFn = artifact.functions.find((fn) => fn.name === "constructor");
    const initializationHash = await computeInitializationHash(
      initFn,
      constructorArgs
    );
    const saltedHash = await computeSaltedInitializationHash({
      initializationHash,
      salt: Fr.fromString(salt),
      deployer: AztecAddress.fromString(deployer),
    });
    const computedAddress = await computeContractAddressFromInstance({
      contractClassId: Fr.fromString(dbContractInstance.contractClassId),
      saltedInitializationHash: saltedHash,
      publicKeys: PublicKeys.fromString(pubKeyString),
    });

    if (address !== computedAddress.toString()) {
      res
        .status(500)
        .send("Uploaded data does not lead to correct contract address");
      return;
    }

    await db.l2Contract.storeContractInstanceRegistration({
      address: computedAddress.toString(),
      salt: salt,
      initializationHash: initializationHash.toString(),
      deployer: deployer,
      publicKeys: pubKeyString,
      constructorArgs: constructorArgs.join(","),
    });

    res.status(200).send("Contract instance registered");
  }
);
