import { z } from "zod";
import {
  chicmozL2BlockLightSchema,
  chicmozL2ContractClassRegisteredEventSchema,
  chicmozL2ContractInstanceDeluxeSchema,
  chicmozL2TxEffectDeluxeSchema,
  chicmozSearchResultsSchema,
} from "@chicmoz-pkg/types";
import { generateSchema } from "@anatine/zod-openapi";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getResponse = (schema: z.ZodType<any, any>) => ({
  "200": {
    description: "Successful response",
    content: {
      "application/json": {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        schema: generateSchema(schema),
      },
    },
  },
});

export const blockResponse = getResponse(chicmozL2BlockLightSchema);
export const blockResponseArray = getResponse(z.array(chicmozL2BlockLightSchema));

export const txEffectResponse = getResponse(chicmozL2TxEffectDeluxeSchema);
export const txEffectResponseArray = getResponse(z.array(chicmozL2TxEffectDeluxeSchema));

export const contractClassResponse = getResponse(chicmozL2ContractClassRegisteredEventSchema);
export const contractClassResponseArray = getResponse(z.array(chicmozL2ContractClassRegisteredEventSchema));

export const contractInstanceResponse = getResponse(chicmozL2ContractInstanceDeluxeSchema);
export const contractInstanceResponseArray = getResponse(z.array(chicmozL2ContractInstanceDeluxeSchema));

export const searchResultResponse = getResponse(chicmozSearchResultsSchema);
