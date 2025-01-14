import asyncHandler from "express-async-handler";
import { controllers as db } from "../../../database/index.js";
import {
  dbWrapper, txResponseArray,
} from "./utils/index.js";

export const openapi_GET_PENDING_TXS = {
  "/l2/txs": {
    get: {
      summary: "Get pending transactions",
      parameters: [
      ],
      responses: txResponseArray
    },
  },
};

export const GET_PENDING_TXS = asyncHandler(async (_req, res) => {
  const txsData = await dbWrapper.getLatest(["l2", "txs"], () =>
    db.l2Tx.getTxs()
  );
  res.status(200).send(txsData);
});

