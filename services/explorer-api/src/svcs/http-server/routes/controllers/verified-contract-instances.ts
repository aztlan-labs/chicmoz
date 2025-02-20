import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { VERIFIED_CONTRACT_INSTANCES_CONTACT } from "../../../../environment.js";
import { controllers as db } from "../../../database/index.js";
import { getVerifiedContractInstanceSchema } from "../paths_and_validation.js";
import { dbWrapper } from "./utils/index.js";
import {
  verifiedContractInstanceResponse,
  verifiedContractInstanceResponseArray,
} from "./utils/open-api-responses.js";

export const openapi_GET_L2_VERIFIED_CONTRACT_INSTANCES_CONTACT = {
  "/l2/verified-contract-instances/contact": {
    get: {
      summary: "Get all verified contract instances",
      responses: verifiedContractInstanceResponseArray,
    },
  },
};

export const GET_L2_VERIFIED_CONTRACT_INSTANCES_CONTACT: RequestHandler = (
  _req,
  res
) => {
  res.status(200).send(JSON.stringify(VERIFIED_CONTRACT_INSTANCES_CONTACT));
};

export const openapi_GET_L2_VERIFIED_CONTRACT_INSTANCE_CONTACT = {
  "/l2/verified-contract-instances/contact/{contractInstanceAddress}": {
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

export const GET_L2_VERIFIED_CONTRACT_INSTANCE_CONTACT: RequestHandler = (
  req,
  res
) => {
  const contractInstanceAddress =
    getVerifiedContractInstanceSchema.parse(req).params.address;
  const verifiedInfo = VERIFIED_CONTRACT_INSTANCES_CONTACT.find(
    (info) => info.address === contractInstanceAddress
  );
  if (!verifiedInfo) throw new Error("Verified contract instance not found"); // TODO: ensure this resolves in a 404
  res.status(200).send(JSON.stringify(verifiedInfo));
};

export const openapi_GET_L2_VERIFIED_CONTRACT_INSTANCE = {
  "/l2/contract-instance/verify/{contractInstanceAddress}": {
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

export const GET_L2_VERIFIED_CONTRACT_INSTANCE: RequestHandler = asyncHandler(
  async (req, res) => {
    const { address } = getVerifiedContractInstanceSchema.parse(req).params;
    const contractInstance = await dbWrapper.get(
      ["l2", "contract-instance-verified", address],
      () => db.l2Contract.getL2DeployedContractInstanceByAddress(address)
    );
    res.status(200).send(contractInstance);
  }
);
