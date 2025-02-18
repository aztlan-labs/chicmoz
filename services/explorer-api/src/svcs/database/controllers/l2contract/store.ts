import { IsTokenArtifactResult } from "@chicmoz-pkg/contract-verification";
import { getDb as db } from "@chicmoz-pkg/postgres-helper";
import {
  type ChicmozL2ContractClassRegisteredEvent,
  type ChicmozL2ContractInstanceDeployedEvent,
  type ChicmozL2PrivateFunctionBroadcastedEvent,
  type ChicmozL2UnconstrainedFunctionBroadcastedEvent,
  type ChicmozL2ContractInstanceRegisteredEvent
} from "@chicmoz-pkg/types";
import { and, eq } from "drizzle-orm";
import {
  l2ContractClassRegistered,
  l2ContractInstanceDeployed,
  l2ContractInstanceRegistered,
  l2PrivateFunction,
  l2UnconstrainedFunction,
} from "../../../database/schema/l2contract/index.js";

export const storeContractInstance = async (
  instance: ChicmozL2ContractInstanceDeployedEvent
): Promise<void> => {
  const { publicKeys, ...rest } = instance;
  await db()
    .insert(l2ContractInstanceDeployed)
    .values({...publicKeys, ...rest});
};

export const storeContractInstanceRegistration = async (
  instance: ChicmozL2ContractInstanceRegisteredEvent
): Promise<void> => {
  await db()
    .insert(l2ContractInstanceRegistered)
    .values({...instance});
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
  artifactJson: string,
  artifactContractName: string,
  tokenResult: IsTokenArtifactResult
): Promise<void> => {
  await db()
    .update(l2ContractClassRegistered)
    .set({
      artifactJson,
      artifactContractName,
      isToken: tokenResult.result,
      whyNotToken: tokenResult.details,
    })
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
