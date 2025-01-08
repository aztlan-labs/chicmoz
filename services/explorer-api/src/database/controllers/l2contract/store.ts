import {
  type ChicmozL2ContractClassRegisteredEvent,
  type ChicmozL2ContractInstanceDeployedEvent,
  type ChicmozL2PrivateFunctionBroadcastedEvent,
  type ChicmozL2UnconstrainedFunctionBroadcastedEvent,
} from "@chicmoz-pkg/types";
import { getDb as db } from "../../../database/index.js";
import {
  l2ContractClassRegistered,
  l2ContractInstanceDeployed,
  l2PrivateFunction,
  l2UnconstrainedFunction,
} from "../../../database/schema/l2contract/index.js";
import { and, eq } from "drizzle-orm";

export const storeContractInstance = async (
  instance: ChicmozL2ContractInstanceDeployedEvent
): Promise<void> => {
  const { publicKeys, ...rest } = instance;
  await db()
    .insert(l2ContractInstanceDeployed)
    .values({
      ...rest,
      publicKeys_masterNullifierPublicKey_x:
        publicKeys.masterNullifierPublicKey.x,
      publicKeys_masterNullifierPublicKey_y:
        publicKeys.masterNullifierPublicKey.y,
      publicKeys_masterNullifierPublicKey_isInfinite:
        publicKeys.masterNullifierPublicKey.isInfinite,
      publicKeys_masterNullifierPublicKey_kind:
        publicKeys.masterNullifierPublicKey.kind,
      publicKeys_masterIncomingViewingPublicKey_x:
        publicKeys.masterIncomingViewingPublicKey.x,
      publicKeys_masterIncomingViewingPublicKey_y:
        publicKeys.masterIncomingViewingPublicKey.y,
      publicKeys_masterIncomingViewingPublicKey_isInfinite:
        publicKeys.masterIncomingViewingPublicKey.isInfinite,
      publicKeys_masterIncomingViewingPublicKey_kind:
        publicKeys.masterIncomingViewingPublicKey.kind,
      publicKeys_masterOutgoingViewingPublicKey_x:
        publicKeys.masterOutgoingViewingPublicKey.x,
      publicKeys_masterOutgoingViewingPublicKey_y:
        publicKeys.masterOutgoingViewingPublicKey.y,
      publicKeys_masterOutgoingViewingPublicKey_isInfinite:
        publicKeys.masterOutgoingViewingPublicKey.isInfinite,
      publicKeys_masterOutgoingViewingPublicKey_kind:
        publicKeys.masterOutgoingViewingPublicKey.kind,
      publicKeys_masterTaggingPublicKey_x: publicKeys.masterTaggingPublicKey.x,
      publicKeys_masterTaggingPublicKey_y: publicKeys.masterTaggingPublicKey.y,
      publicKeys_masterTaggingPublicKey_isInfinite:
        publicKeys.masterTaggingPublicKey.isInfinite,
      publicKeys_masterTaggingPublicKey_kind:
        publicKeys.masterTaggingPublicKey.kind,
    });
};
export const storeContractClass = async (
  contractClass: ChicmozL2ContractClassRegisteredEvent
): Promise<void> => {
  await db()
    .insert(l2ContractClassRegistered)
    .values({
      ...contractClass,
    });
};

export const addArtifactJson = async (
  contractClassId: string,
  version: number,
  artifactJson: string
): Promise<void> => {
  await db()
    .update(l2ContractClassRegistered)
    .set({ artifactJson })
    .where(
      and(
        eq(l2ContractClassRegistered.contractClassId, contractClassId),
        eq(l2ContractClassRegistered.version, version)
      )
    )
    .execute();
};

export const storePrivateFunction = async (
  privateFunctionBroadcast: ChicmozL2PrivateFunctionBroadcastedEvent
): Promise<void> => {
  const { privateFunction, ...rest } = privateFunctionBroadcast;
  await db()
    .insert(l2PrivateFunction)
    .values({
      ...rest,
      privateFunction_selector_value: privateFunction.selector.value,
      privateFunction_metadataHash: privateFunction.metadataHash,
      privateFunction_vkHash: privateFunction.vkHash,
      privateFunction_bytecode: privateFunction.bytecode,
    });
};

export const storeUnconstrainedFunction = async (
  unconstrainedFunctionBroadcast: ChicmozL2UnconstrainedFunctionBroadcastedEvent
): Promise<void> => {
  const { unconstrainedFunction, ...rest } = unconstrainedFunctionBroadcast;
  await db()
    .insert(l2UnconstrainedFunction)
    .values({
      ...rest,
      unconstrainedFunction_selector_value:
        unconstrainedFunction.selector.value,
      unconstrainedFunction_metadataHash: unconstrainedFunction.metadataHash,
      unconstrainedFunction_bytecode: unconstrainedFunction.bytecode,
    });
};
