import {
  chicmozL2PrivateFunctionBroadcastedEventSchema,
  chicmozL2UnconstrainedFunctionBroadcastedEventSchema,
  type ChicmozL2PrivateFunctionBroadcastedEvent,
  type ChicmozL2UnconstrainedFunctionBroadcastedEvent,
} from "@chicmoz-pkg/types";
import { and, eq, getTableColumns } from "drizzle-orm";
import { getDb as db } from "../../../database/index.js";
import {
  l2PrivateFunction,
  l2UnconstrainedFunction,
} from "../../schema/index.js";

export const getL2ContractClassPrivateFunction = async (
  classId: ChicmozL2PrivateFunctionBroadcastedEvent["contractClassId"],
  functionSelector: ChicmozL2PrivateFunctionBroadcastedEvent["privateFunction"]["selector"]["value"]
): Promise<ChicmozL2PrivateFunctionBroadcastedEvent | null> => {
  const res = await db()
    .select({
      ...getTableColumns(l2PrivateFunction),
    })
    .from(l2PrivateFunction)
    .where(
      and(
        eq(l2PrivateFunction.contractClassId, classId),
        eq(l2PrivateFunction.privateFunction_selector_value, functionSelector)
      )
    )
    .limit(1);

  return res.length > 0
    ? chicmozL2PrivateFunctionBroadcastedEventSchema.parse({
      contractClassId: res[0].contractClassId,
      artifactMetadataHash: res[0].artifactMetadataHash,
      unconstrainedFunctionsArtifactTreeRoot: res[0].unconstrainedFunctionsArtifactTreeRoot,
      privateFunctionTreeSiblingPath: res[0].privateFunctionTreeSiblingPath,
      privateFunctionTreeLeafIndex: res[0].privateFunctionTreeLeafIndex,
      artifactFunctionTreeSiblingPath: res[0].artifactFunctionTreeSiblingPath,
      artifactFunctionTreeLeafIndex: res[0].artifactFunctionTreeLeafIndex,
      privateFunction: {
        selector: {
          type: res[0].privateFunction_selector_type,
          value: res[0].privateFunction_selector_value,
        },
        metadataHash: res[0].privateFunction_metadataHash,
        vkHash: res[0].privateFunction_vkHash,
        bytecode: res[0].privateFunction_bytecode,
      },
    })
    : null;
};

export const getL2ContractClassPrivateFunctions = async (
  classId: ChicmozL2PrivateFunctionBroadcastedEvent["contractClassId"]
): Promise<Array<ChicmozL2PrivateFunctionBroadcastedEvent>> => {
  const res = await db()
    .select({
      ...getTableColumns(l2PrivateFunction),
    })
    .from(l2PrivateFunction)
    .where(eq(l2PrivateFunction.contractClassId, classId));
  return res.map((r) =>
    chicmozL2PrivateFunctionBroadcastedEventSchema.parse({
      contractClassId: r.contractClassId,
      artifactMetadataHash: r.artifactMetadataHash,
      unconstrainedFunctionsArtifactTreeRoot: r.unconstrainedFunctionsArtifactTreeRoot,
      privateFunctionTreeSiblingPath: r.privateFunctionTreeSiblingPath,
      privateFunctionTreeLeafIndex: r.privateFunctionTreeLeafIndex,
      artifactFunctionTreeSiblingPath: r.artifactFunctionTreeSiblingPath,
      artifactFunctionTreeLeafIndex: r.artifactFunctionTreeLeafIndex,
      privateFunction: {
        selector: {
          type: r.privateFunction_selector_type,
          value: r.privateFunction_selector_value,
        },
        metadataHash: r.privateFunction_metadataHash,
        vkHash: r.privateFunction_vkHash,
        bytecode: r.privateFunction_bytecode,
      },
    })
  );
};

export const getL2ContractClassUnconstrainedFunction = async (
  classId: ChicmozL2UnconstrainedFunctionBroadcastedEvent["contractClassId"],
  functionSelector: ChicmozL2UnconstrainedFunctionBroadcastedEvent["unconstrainedFunction"]["selector"]["value"]
): Promise<ChicmozL2UnconstrainedFunctionBroadcastedEvent | null> => {
  const res = await db()
    .select({
      ...getTableColumns(l2UnconstrainedFunction),
    })
    .from(l2UnconstrainedFunction)
    .where(
      and(
        eq(l2UnconstrainedFunction.contractClassId, classId),
        eq(
          l2UnconstrainedFunction.unconstrainedFunction_selector_value,
          functionSelector
        )
      )
    )
    .limit(1);
  return res.length > 0
    ? chicmozL2UnconstrainedFunctionBroadcastedEventSchema.parse({
      contractClassId: res[0].contractClassId,
      artifactMetadataHash: res[0].artifactMetadataHash,
      privateFunctionsArtifactTreeRoot: res[0].privateFunctionsArtifactTreeRoot,
      artifactFunctionTreeSiblingPath: res[0].artifactFunctionTreeSiblingPath,
      artifactFunctionTreeLeafIndex: res[0].artifactFunctionTreeLeafIndex,
      unconstrainedFunction: {
        selector: {
          type: res[0].unconstrainedFunction_selector_type,
          value: res[0].unconstrainedFunction_selector_value,
        },
        metadataHash: res[0].unconstrainedFunction_metadataHash,
        bytecode: res[0].unconstrainedFunction_bytecode,
      },
    })
    : null;
};

export const getL2ContractClassUnconstrainedFunctions = async (
  classId: ChicmozL2UnconstrainedFunctionBroadcastedEvent["contractClassId"]
): Promise<Array<ChicmozL2UnconstrainedFunctionBroadcastedEvent>> => {
  const res = await db()
    .select({
      ...getTableColumns(l2UnconstrainedFunction),
    })
    .from(l2UnconstrainedFunction)
    .where(eq(l2UnconstrainedFunction.contractClassId, classId));
  return res.map((r) =>
    chicmozL2UnconstrainedFunctionBroadcastedEventSchema.parse({
      contractClassId: r.contractClassId,
      artifactMetadataHash: r.artifactMetadataHash,
      privateFunctionsArtifactTreeRoot: r.privateFunctionsArtifactTreeRoot,
      artifactFunctionTreeSiblingPath: r.artifactFunctionTreeSiblingPath,
      artifactFunctionTreeLeafIndex: r.artifactFunctionTreeLeafIndex,
      unconstrainedFunction: {
        selector: {
          type: r.unconstrainedFunction_selector_type,
          value: r.unconstrainedFunction_selector_value,
        },
        metadataHash: r.unconstrainedFunction_metadataHash,
        bytecode: r.unconstrainedFunction_bytecode,
      },
    })
  );
};