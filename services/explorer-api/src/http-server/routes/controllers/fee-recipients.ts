import asyncHandler from "express-async-handler";
import {
  dbWrapper,
  feeRecipientResponseArray,
} from "./utils/index.js";
import { controllers as db } from "../../../database/index.js";

export const openapi_GET_L2_FEE_RECIPIENTS = {
  "/l2/fee-recipients": {
    get: {
      summary: "Get fee recipients",
      responses: feeRecipientResponseArray,
    },
  },
};

export const GET_L2_FEE_RECIPIENTS = asyncHandler(async (_req, res) => {
  const feeRecipients = await dbWrapper.getLatest(["l2", "fee-recipients"], db.l2Block.getFeeRecipients);
  if (!feeRecipients) throw new Error("Fee recipients not found");
  res.status(200).send(feeRecipients);
});
