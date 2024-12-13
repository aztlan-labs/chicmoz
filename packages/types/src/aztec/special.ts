import { z } from "zod";
import { chicmozL2BlockSchema } from "./l2Block.js";
import {
  chicmozL2ContractClassRegisteredEventSchema,
  chicmozL2ContractInstanceDeployedEventSchema,
} from "./l2Contract.js";
import { chicmozL2TxEffectSchema } from "./l2TxEffect.js";

export const chicmozL2VerifiedContractAddressDataSchema = z.object({
  contractInstanceAddress: z.string(),
  name: z.string(),
  details: z.string(),
  contact: z.string(),
  uiUrl: z.string(),
  repoUrl: z.string(),
});

export type ChicmozL2VerifiedContractAddressData = z.infer<
  typeof chicmozL2VerifiedContractAddressDataSchema
>;

export const chicmozL2ContractInstanceDeluxeSchema = z.object({
  ...chicmozL2ContractInstanceDeployedEventSchema.shape,
  ...chicmozL2ContractClassRegisteredEventSchema.shape,
  blockHeight: chicmozL2BlockSchema.shape.height.optional(),
  verifiedInfo: chicmozL2VerifiedContractAddressDataSchema.optional(),
});

export type ChicmozL2ContractInstanceDeluxe = z.infer<
  typeof chicmozL2ContractInstanceDeluxeSchema
>;

export const chicmozL2TxEffectDeluxeSchema = z.object({
  ...chicmozL2TxEffectSchema.shape,
  blockHeight: z.lazy(() => chicmozL2BlockSchema.shape.height),
  txBirthTimestamp: z.number(),
  timestamp: z.lazy(
    () =>
      chicmozL2BlockSchema.shape.header.shape.globalVariables.shape.timestamp
  ),
});

export type ChicmozL2TxEffectDeluxe = z.infer<
  typeof chicmozL2TxEffectDeluxeSchema
>;

export const chicmozL2BlockLightSchema = z.object({
  ...chicmozL2BlockSchema.shape,
  body: z.object({
    txEffects: z.array(chicmozL2TxEffectSchema.pick({ hash: true })),
  }),
});

export type ChicmozL2BlockLight = z.infer<typeof chicmozL2BlockLightSchema>;
