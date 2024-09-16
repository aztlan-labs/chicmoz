import { z } from "zod";
import { aztecAddressSchema, frSchema } from "./utils.js";

export const chicmozL2ContractInstanceDeployedEventSchema = z.object({
  address: aztecAddressSchema,
  version: z.number(),
  salt: frSchema,
  contractClassId: frSchema,
  initializationHash: frSchema,
  publicKeysHash: frSchema,
  deployer: aztecAddressSchema,
});

export type ChicmozL2ContractInstanceDeployedEvent = z.infer<
  typeof chicmozL2ContractInstanceDeployedEventSchema
>;

export const chicmozL2ContractClassRegisteredEventSchema = z.object({
  contractClassId: frSchema,
  version: z.number(),
  artifactHash: frSchema,
  privateFunctionsRoot: frSchema,
  packedPublicBytecode: z.instanceof(Buffer),
});

export type ChicmozL2ContractClassRegisteredEvent = z.infer<
  typeof chicmozL2ContractClassRegisteredEventSchema
>;
