import { z } from "zod";
import { chicmozL2BlockSchema } from "./l2Block.js";
import {
  chicmozL2ContractClassRegisteredEventSchema,
  chicmozL2ContractInstanceDeployedEventSchema,
} from "./l2Contract.js";
import { chicmozL2TxEffectSchema } from "./l2TxEffect.js";

export const chicmozL2ContractInstanceDeluxeSchema = z.object({
  ...chicmozL2ContractInstanceDeployedEventSchema.shape,
  ...chicmozL2ContractClassRegisteredEventSchema.shape,
  blockHeight: chicmozL2BlockSchema.shape.height.optional(),
});

export type ChicmozL2ContractInstanceDeluxe = z.infer<
  typeof chicmozL2ContractInstanceDeluxeSchema
>;

export const chicmozL2TxEffectDeluxeSchema = z.object({
  ...chicmozL2TxEffectSchema.shape,
  blockHeight: z.lazy(() => chicmozL2BlockSchema.shape.height),
  timestamp: z.lazy(
    () =>
      chicmozL2BlockSchema.shape.header.shape.globalVariables.shape.timestamp
  ),
});

export type ChicmozL2TxEffectDeluxe = z.infer<
  typeof chicmozL2TxEffectDeluxeSchema
>;
