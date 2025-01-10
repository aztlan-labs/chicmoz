import { RequestHandler } from "express";
import { VERIFIED_CONTRACT_INSTANCES } from "../../../environment.js";
import { getVerifiedContractInstanceSchema } from "../paths_and_validation.js";
import {
  verifiedContractInstanceResponse,
  verifiedContractInstanceResponseArray,
} from "./utils/open-api-responses.js";

export const openapi_GET_L2_VERIFIED_CONTRACT_INSTANCES = {
  "/l2/verified-contract-instances": {
    get: {
      summary: "Get all verified contract instances",
      responses: verifiedContractInstanceResponseArray,
    },
  },
};

export const GET_L2_VERIFIED_CONTRACT_INSTANCES: RequestHandler = (_req, res) => {
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
