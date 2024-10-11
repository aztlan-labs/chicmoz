/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import {
  chicmozL2BlockSchema,
  chicmozL2ContractInstanceDeluxeSchema,
  chicmozL2TxEffectDeluxeSchema,
} from "@chicmoz-pkg/types";
import { generateSchema } from "@anatine/zod-openapi";

export const blockResponse = {
  "200": {
    description: "Successful response",
    content: {
      "application/json": {
        schema: generateSchema(chicmozL2BlockSchema),
      },
    },
  },
};

export const blockResponseArray = {
  "200": {
    description: "Successful response",
    content: {
      "application/json": {
        schema: generateSchema(z.array(chicmozL2BlockSchema)),
      },
    },
  },
};

export const txEffectResponse = {
  "200": {
    description: "Successful response",
    content: {
      "application/json": {
        schema: generateSchema(chicmozL2TxEffectDeluxeSchema),
      },
    },
  },
};

export const txEffectResponseArray = {
  "200": {
    description: "Successful response",
    content: {
      "application/json": {
        schema: generateSchema(z.array(chicmozL2TxEffectDeluxeSchema)),
      },
    },
  },
};

export const contractInstanceResponse = {
  "200": {
    description: "Successful response",
    content: {
      "application/json": {
        schema: generateSchema(chicmozL2ContractInstanceDeluxeSchema),
      },
    },
  },
};

export const contractInstanceResponseArray = {
  "200": {
    description: "Successful response",
    content: {
      "application/json": {
        schema: generateSchema(z.array(chicmozL2ContractInstanceDeluxeSchema)),
      },
    },
  },
};
