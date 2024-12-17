import asyncHandler from "express-async-handler";
import { dbWrapper } from "./utils/index.js";
import { controllers as db } from "../../../database/index.js";

export const GET_L2_VALIDATORS = asyncHandler(async (_req, res) => {
  const validators = await dbWrapper.getLatest(["l2", "validators"], db.l2Block.getValidators);
  if (!validators) throw new Error("Validators not found");
  res.status(200).send(validators);
});
