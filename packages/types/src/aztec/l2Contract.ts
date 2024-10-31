import { z } from "zod";
import {
  aztecAddressSchema,
  bufferSchema,
  frPointSchema,
  frSchema,
} from "./utils.js";
import { chicmozL2BlockSchema } from "./l2Block.js";

export const chicmozL2ContractInstanceDeployedEventSchema = z.object({
  address: aztecAddressSchema,
  blockHash: chicmozL2BlockSchema.shape.hash,
  version: z.number(),
  salt: frSchema,
  contractClassId: frSchema,
  initializationHash: frSchema,
  deployer: aztecAddressSchema,
  publicKeys: z.object({
    masterNullifierPublicKey: frPointSchema,
    masterIncomingViewingPublicKey: frPointSchema,
    masterOutgoingViewingPublicKey: frPointSchema,
    masterTaggingPublicKey: frPointSchema,
  }),
});

export type ChicmozL2ContractInstanceDeployedEvent = z.infer<
  typeof chicmozL2ContractInstanceDeployedEventSchema
>;

export const chicmozL2ContractClassRegisteredEventSchema = z.object({
  blockHash: chicmozL2BlockSchema.shape.hash,
  contractClassId: frSchema,
  version: z.number(),
  artifactHash: frSchema,
  privateFunctionsRoot: frSchema,
  packedPublicBytecode: bufferSchema,
});

export type ChicmozL2ContractClassRegisteredEvent = z.infer<
  typeof chicmozL2ContractClassRegisteredEventSchema
>;

const functionSelectorSchema = z.object({
  type: z.enum(["FunctionSelector"]),
  value: z.string(),
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
