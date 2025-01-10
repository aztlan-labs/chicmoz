import asyncHandler from "express-async-handler";
import { dbWrapper,
  l1L2ValidatorResponseArray,
} from "./utils/index.js";
import { controllers as db } from "../../../database/index.js";

export const openapi_GET_L1_L2_VALIDATORS = {
  "/l1/l2-validators": {
    get: {
      summary: "Get L1 and L2 validators",
      responses: l1L2ValidatorResponseArray,
    },
  },
};

export const GET_L1_L2_VALIDATORS = asyncHandler(async (_req, res) => {
  const validators = await dbWrapper.getLatest(["l1", "l2-validators"], db.l1.getAllL1L2Validators);
  if (!validators) throw new Error("Validators not found");
  res.status(200).send(validators);
});
