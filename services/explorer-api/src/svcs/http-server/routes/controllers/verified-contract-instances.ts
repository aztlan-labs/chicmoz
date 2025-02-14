import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { getVerifiedContractInstanceSchema, postVerifiedContractInstanceSchema } from "../paths_and_validation.js";
import {
  verifiedContractInstanceResponse,
  verifiedContractInstanceResponseArray,
} from "./utils/open-api-responses.js";
import { controllers as db } from "../../../database/index.js";
import { VERIFIED_CONTRACT_INSTANCES } from "../../../../environment.js";
import {
  dbWrapper,
} from "./utils/index.js";

import { NoirCompiledContract, loadContractArtifact, Fr, AztecAddress, PublicKeys } from "@aztec/aztec.js";
import { computeInitializationHash, computeSaltedInitializationHash, computeContractAddressFromInstance, getContractClassFromArtifact } from"@aztec/circuits.js"
import { chicmozL2ContractClassRegisteredEventSchema, chicmozL2ContractInstanceDeployedEventSchema } from "@chicmoz-pkg/types";

export const openapi_GET_L2_VERIFIED_CONTRACT_INSTANCES = {
  "/l2/verified-contract-instances": {
    get: {
      summary: "Get all verified contract instances",
      responses: verifiedContractInstanceResponseArray,
    },
  },
};

export const GET_L2_VERIFIED_CONTRACT_INSTANCES: RequestHandler = (
  _req,
  res
) => {
  res.status(200).send(JSON.stringify(VERIFIED_CONTRACT_INSTANCES));
};

export const openapi_GET_L2_VERIFIED_CONTRACT_INSTANCE = {
  "/l2/verified-contract-instances/{contractInstanceAddress}": {
    get: {
      summary: "Get a verified contract instance by address",
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
      responses: verifiedContractInstanceResponse,
    },
  },
};

export const GET_L2_VERIFIED_CONTRACT_INSTANCE: RequestHandler = (req, res) => {
  const contractInstanceAddress =
    getVerifiedContractInstanceSchema.parse(req).params.address;
  const verifiedInfo = VERIFIED_CONTRACT_INSTANCES.find(
    (info) => info.address === contractInstanceAddress
  );
  if (!verifiedInfo) throw new Error("Verified contract instance not found"); // TODO: ensure this resolves in a 404
  res.status(200).send(JSON.stringify(verifiedInfo));
};

export const openapi_POST_L2_VERIFIED_CONTRACT_INSTANCE = {
  "/l2/contract-instance/verify/{contractInstanceAddress}": {
    get: {
      summary: "Post a verified contract instance by address",
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
      responses: verifiedContractInstanceResponse,
    },
  },
};

export const POST_L2_VERIFIED_CONTRACT_INSTANCE = asyncHandler(
  async (req, res) => {
    const {
      params: { address },
      body: { stringifiedArtifactJson, version, publicKeys, salt, deployer, args },
    } = postVerifiedContractInstanceSchema.parse(req);
    const instanceData = await dbWrapper.get(["l2", "contracts", address], () =>
      db.l2Contract.getL2DeployedContractInstanceByAddress(address)
    );
    
    if (!instanceData) 
      res.status(404).send("Contract instance not found")
    
    const contractInstance = chicmozL2ContractInstanceDeployedEventSchema.parse(
      JSON.parse(instanceData!)
    );
    
    const pubkeySplit = Object.values(contractInstance.publicKeys).map((key)=> key.split("0x")[1])
    const pubKeyString = "0x".concat(pubkeySplit.join(""))
    
    if (publicKeys && publicKeys !== pubKeyString){
      res.status(500).send("Uploaded publicKeys do not match the DB")
      return
    }

    if (salt && salt !== contractInstance.salt){
      res.status(500).send("Uploaded salt does not match the DB")
      return
    }

    if (deployer && deployer !== contractInstance.deployer){
      res.status(500).send("Uploaded deployer does not match the DB")
      return
    }

    const artifact = loadContractArtifact(
      JSON.parse(stringifiedArtifactJson) as unknown as NoirCompiledContract
    )

    const classId = contractInstance.contractClassId
    const contractClassString = await dbWrapper.get(
      ["l2", "contract-classes", classId, version],
      () => db.l2Contract.getL2RegisteredContractClass(classId, version)
    );

    const contractClass = chicmozL2ContractClassRegisteredEventSchema.parse(
      JSON.parse(contractClassString!)
    );

    if (!contractClass) {
      res.status(500).send("Contract class found in DB is not valid");
      return;
    }

    const uploadedCCArtifact = await getContractClassFromArtifact(artifact);

    const isMatchingByteCode = uploadedCCArtifact.packedBytecode.equals(
      contractClass.packedBytecode
    );
    if (!isMatchingByteCode) {
      res.status(500).send("Uploaded artifact does not match known artifact")
      return
    }

    const initFn = artifact.functions.find((fn)=> fn.name === "constructor")
    const initializationHash = await computeInitializationHash(initFn, args)
    const saltedHash = await computeSaltedInitializationHash({initializationHash, salt: Fr.fromString(salt!), deployer: AztecAddress.fromString(deployer!)})
    const computedAddress = await computeContractAddressFromInstance({contractClassId: Fr.fromString(classId), saltedInitializationHash: saltedHash, publicKeys: PublicKeys.fromString(pubKeyString)})
    
    if (address !== computedAddress.toString()) {
      res.status(500).send("Uploaded data does not lead to correct contract address")
      return
    }

    await db.l2Contract.storeContractInstanceRegistration({
      address:computedAddress.toString(),
      blockHash: contractInstance.blockHash,
      version,
      salt: salt!,
      initializationHash:initializationHash.toString(),
      deployer: deployer!,
      publicKeys:pubKeyString,
      args: JSON.stringify(args),
      artifactJson: stringifiedArtifactJson,
    });

    res.status(200).send("Contract instance registered");
  }
);
