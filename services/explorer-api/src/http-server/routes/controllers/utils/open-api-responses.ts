import { z } from "zod";
import {
  chicmozL2BlockLightSchema,
  chicmozL2ContractClassRegisteredEventSchema,
  chicmozL2ContractInstanceDeluxeSchema,
  chicmozL2PendingTxSchema,
  chicmozL2PrivateFunctionBroadcastedEventSchema,
  chicmozL2TxEffectDeluxeSchema,
  chicmozL2UnconstrainedFunctionBroadcastedEventSchema,
  chicmozSearchResultsSchema,
  chicmozL2VerifiedContractInstanceDataSchema,
  chicmozFeeRecipientSchema,
  chicmozL1L2ValidatorSchema,
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

export const feeRecipientResponseArray = getResponse(z.array(chicmozFeeRecipientSchema));

export const txEffectResponse = getResponse(chicmozL2TxEffectDeluxeSchema);
export const txEffectResponseArray = getResponse(z.array(chicmozL2TxEffectDeluxeSchema));

export const txResponse = getResponse(chicmozL2PendingTxSchema);
export const txResponseArray = getResponse(z.array(chicmozL2PendingTxSchema));

export const contractClassResponse = getResponse(chicmozL2ContractClassRegisteredEventSchema);
export const contractClassResponseArray = getResponse(z.array(chicmozL2ContractClassRegisteredEventSchema));

export const contractClassPrivateFunctionResponse = getResponse(chicmozL2PrivateFunctionBroadcastedEventSchema);
export const contractClassPrivateFunctionResponseArray = getResponse(z.array(chicmozL2PrivateFunctionBroadcastedEventSchema));

export const contractClassUnconstrainedFunctionResponse = getResponse(chicmozL2UnconstrainedFunctionBroadcastedEventSchema);
export const contractClassUnconstrainedFunctionResponseArray = getResponse(z.array(chicmozL2UnconstrainedFunctionBroadcastedEventSchema));

export const contractInstanceResponse = getResponse(chicmozL2ContractInstanceDeluxeSchema);
export const contractInstanceResponseArray = getResponse(z.array(chicmozL2ContractInstanceDeluxeSchema));

export const verifiedContractInstanceResponse = getResponse(chicmozL2VerifiedContractInstanceDataSchema);
export const verifiedContractInstanceResponseArray = getResponse(z.array(chicmozL2VerifiedContractInstanceDataSchema));

export const searchResultResponse = getResponse(chicmozSearchResultsSchema);

export const l1L2ValidatorResponseArray = getResponse(z.array(chicmozL1L2ValidatorSchema));
