import asyncHandler from "express-async-handler";
import { L2_NETWORK_ID } from "../../../../environment.js";
import { controllers as db } from "../../../database/index.js";
import {
  chainErrorsResponse,
  chainInfoResponse,
  dbWrapper,
} from "./utils/index.js";

export const openapi_GET_CHAIN_INFO = {
  "/l2/info": {
    get: {
      summary: "Get L2 chain info",
      responses: chainInfoResponse,
    },
  },
};

export const GET_CHAIN_INFO = asyncHandler(async (_req, res) => {
  const chainInfo = await dbWrapper.get(["l2", "chain-info"], () =>
    db.l2.getL2ChainInfo(L2_NETWORK_ID)
  );
  if (!chainInfo) throw new Error("Chain info not found");
  res.status(200).send(chainInfo);
});

export const openapi_GET_CHAIN_ERRORS = {
  "/l2/errors": {
    get: {
      summary: "Get L2 chain errors",
      responses: chainErrorsResponse,
    },
  },
};

export const GET_CHAIN_ERRORS = asyncHandler(async (_req, res) => {
  const chainErrors = await dbWrapper.getLatest(
    ["l2", "chain-errors"],
    db.l2.getL2RpcNodeErrors
  );
  if (!chainErrors) throw new Error("Chain errors not found");
  res.status(200).send(chainErrors);
});
