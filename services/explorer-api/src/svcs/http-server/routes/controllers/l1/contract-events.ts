import asyncHandler from "express-async-handler";
import { controllers as db } from "../../../../database/index.js";
import { contractEventsResponse, dbWrapper } from "../utils/index.js";

export const openapi_GET_L1_CONTRACT_EVENTS = {
  "/l1/contract-events": {
    get: {
      summary: "Get L1 contract events",
      parameters: [],
      responses: contractEventsResponse,
    },
  },
};

export const GET_L1_CONTRACT_EVENTS = asyncHandler(async (_req, res) => {
  const contractEventsData = await dbWrapper.getLatest(
    ["l1", "contract-events"],
    () => db.l1.contractEvents.get()
  );
  res.status(200).send(contractEventsData);
});
