import { v4 as uuidv4 } from "uuid";
import {
  type ChicmozL2ContractClassRegisteredEvent,
  type ChicmozL2ContractInstanceDeployedEvent,
} from "@chicmoz-pkg/types";
import { getDb as db } from "../../../database/index.js";
import {
  l2ContractInstanceDeployed,
  l2ContractClassRegistered,
} from "../../../database/schema/l2contract/index.js";

export const storeContractInstance = async (
  instance: ChicmozL2ContractInstanceDeployedEvent,
  block_hash: string
): Promise<void> => {
  const instanceId = uuidv4();

  await db()
    .insert(l2ContractInstanceDeployed)
    .values({
      id: instanceId,
      block_hash,
      ...instance,
    })
    .onConflictDoNothing();
};
export const storeContractClass = async (
  contractClass: ChicmozL2ContractClassRegisteredEvent,
  block_hash: string
): Promise<void> => {
  const classId = uuidv4();

  await db()
    .insert(l2ContractClassRegistered)
    .values({
      id: classId,
      block_hash,
      ...contractClass,
    })
    .onConflictDoNothing();
};
