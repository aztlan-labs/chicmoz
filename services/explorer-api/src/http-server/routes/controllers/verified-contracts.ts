import { RequestHandler } from "express";
import { VERIFIED_CONTRACT_ADDRESSES } from "../../../environment.js";
import {
  verifiedContractResponse,
  verifiedContractResponseArray,
} from "./utils/open-api-responses.js";
import { getVerifiedContractSchema } from "../paths_and_validation.js";

export const openapi_GET_VERIFIED_CONTRACTS = {
  "/l2/verified-contracts": {
    get: {
      summary: "Get the latest block",
      responses: verifiedContractResponseArray,
    },
  },
};

export const GET_L2_VERIFIED_CONTRACTS: RequestHandler = (_req, res) => {
  res.status(200).send(JSON.stringify(VERIFIED_CONTRACT_ADDRESSES));
};

export const openapi_GET_VERIFIED_CONTRACT = {
  "/l2/verified-contracts/{contractInstanceAddress}": {
    get: {
      summary: "Get a verified contract by address",
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
      responses: verifiedContractResponse,
    },
  },
};

export const GET_L2_VERIFIED_CONTRACT: RequestHandler = (req, res) => {
  const contractInstanceAddress =
    getVerifiedContractSchema.parse(req).params.address;
  const verifiedInfo = VERIFIED_CONTRACT_ADDRESSES.find(
    (info) => info.contractInstanceAddress === contractInstanceAddress
  );
  if (!verifiedInfo) throw new Error("Contract not found"); // TODO: ensure this resolves in a 404
  res.status(200).send(JSON.stringify(verifiedInfo));
};
