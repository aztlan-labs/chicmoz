import { z } from "zod";
import { aztecAddressSchema } from "../general.js";
import { chicmozL2BlockSchema } from "./l2Block.js";
import { bufferSchema, frSchema, frLongSchema } from "./utils.js";

export const chicmozL2ContractInstanceDeployedEventSchema = z.object({
  address: aztecAddressSchema,
  blockHash: chicmozL2BlockSchema.shape.hash,
  version: z.number(),
  salt: frSchema,
  contractClassId: frSchema,
  initializationHash: frSchema,
  deployer: aztecAddressSchema,
  publicKeys: z.object({
    masterNullifierPublicKey: frLongSchema,
    masterIncomingViewingPublicKey: frLongSchema,
    masterOutgoingViewingPublicKey: frLongSchema,
    masterTaggingPublicKey: frLongSchema,
  }),
});

export type ChicmozL2ContractInstanceDeployedEvent = z.infer<
  typeof chicmozL2ContractInstanceDeployedEventSchema
>;

export const chicmozL2ContractInstanceRegisteredSchema = z.object({
  address: aztecAddressSchema,
  blockHash: chicmozL2BlockSchema.shape.hash,
  version: z.number(),
  salt: frSchema,
  initializationHash: frSchema,
  deployer: aztecAddressSchema,
  publicKeys: z.string(),
  args: z.string(),
  artifactJson: z.string().nullable().optional(),
});

export type ChicmozL2ContractInstanceRegisteredEvent = z.infer<
  typeof chicmozL2ContractInstanceRegisteredSchema
>;

export const chicmozL2ContractClassRegisteredEventSchema = z.object({
  blockHash: chicmozL2BlockSchema.shape.hash,
  contractClassId: frSchema,
  version: z.number(),
  artifactHash: frSchema,
  privateFunctionsRoot: frSchema,
  packedBytecode: bufferSchema,
  artifactJson: z.string().nullable().optional(),
  isToken: z.boolean().nullable().optional(),
});

export type ChicmozL2ContractClassRegisteredEvent = z.infer<
  typeof chicmozL2ContractClassRegisteredEventSchema
>;

const functionSelectorSchema = z.object({
  value: z.number(),
});

export const chicmozL2PrivateFunctionBroadcastedEventSchema = z.object({
  contractClassId:
    chicmozL2ContractClassRegisteredEventSchema.shape.contractClassId,
  artifactMetadataHash: frSchema,
  unconstrainedFunctionsArtifactTreeRoot: frSchema,
  privateFunctionTreeSiblingPath: z.array(frSchema), // TODO: is it fixed size?
  privateFunctionTreeLeafIndex: z.number(),
  artifactFunctionTreeSiblingPath: z.array(frSchema), // TODO: is it fixed size?
  artifactFunctionTreeLeafIndex: z.number(),
  privateFunction: z.object({
    selector: functionSelectorSchema,
    metadataHash: frSchema,
    vkHash: frSchema,
    bytecode: bufferSchema,
  }),
});

export type ChicmozL2PrivateFunctionBroadcastedEvent = z.infer<
  typeof chicmozL2PrivateFunctionBroadcastedEventSchema
>;

export const chicmozL2UnconstrainedFunctionBroadcastedEventSchema = z.object({
  contractClassId:
    chicmozL2ContractClassRegisteredEventSchema.shape.contractClassId,
  artifactMetadataHash: frSchema,
  privateFunctionsArtifactTreeRoot: frSchema,
  artifactFunctionTreeSiblingPath: z.array(frSchema), // TODO: is it fixed size?
  artifactFunctionTreeLeafIndex: z.number(),
  unconstrainedFunction: z.object({
    selector: functionSelectorSchema,
    metadataHash: frSchema,
    bytecode: bufferSchema,
  }),
});

export type ChicmozL2UnconstrainedFunctionBroadcastedEvent = z.infer<
  typeof chicmozL2UnconstrainedFunctionBroadcastedEventSchema
>;
