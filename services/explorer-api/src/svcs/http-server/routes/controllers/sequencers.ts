/* eslint-disable @typescript-eslint/no-unused-vars */
import asyncHandler from "express-async-handler";
import {
  sequencerErrorResponseArray,
  sequencerResponse,
  sequencerResponseArray,
} from "./utils/index.js";

export const openapi_GET_L2_SEQUENCERS = {
  "/l2/sequencers": {
    get: {
      summary: "Get all L2 sequencers",
      responses: sequencerResponseArray,
    },
  },
};

export const GET_L2_SEQUENCERS = asyncHandler(async (_req, res) => {
  //const sequencers = await dbWrapper.getLatest(
  //  ["l2", "sequencers"],
  //  db.l2.getAllSequencers
  //);
  //if (!sequencers) throw new Error("Sequencers not found");
  //res.status(200).send(sequencers);
});

export const openapi_GET_L2_SEQUENCER = {
  "/l2/sequencers/:enr": {
    get: {
      summary: "Get L2 sequencer by ENR",
      parameters: [
        {
          name: "enr",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: sequencerResponse,
    },
  },
};

export const GET_L2_SEQUENCER = asyncHandler(async (req, res) => {
  //const { enr } = getSequencerSchema.parse(req).params;
  //const sequencer = await dbWrapper.get(["l2", "sequencers", enr], () =>
  //  db.l2.getSequencer(enr)
  //);
  //if (!sequencer) throw new Error("Sequencer not found");
  //res.status(200).send(sequencer);
});

export const openapi_GET_L2_SEQUENCER_ERRORS = {
  "/l2/sequencers/:enr/errors": {
    get: {
      summary: "Get L2 sequencer errors by ENR",
      parameters: [
        {
          name: "enr",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: sequencerErrorResponseArray,
    },
  },
};

export const GET_L2_SEQUENCER_ERRORS = asyncHandler(async (req, res) => {
  //const { enr } = getSequencerSchema.parse(req).params;
  //const errors = await dbWrapper.get(["l2", "sequencers", enr, "errors"], () =>
  //  db.l2.getSequencerErrors(enr)
  //);
  //res.status(200).send(errors);
});
