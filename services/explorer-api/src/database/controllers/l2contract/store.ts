/* eslint-disable no-console, @typescript-eslint/no-unsafe-member-access */

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

  await db()
    .insert(l2ContractInstanceDeployed)
    .values({
      block_hash,
      ...instance,
    })
    .onConflictDoNothing();
};
export const storeContractClass = async (
  contractClass: ChicmozL2ContractClassRegisteredEvent,
  block_hash: string
): Promise<void> => {

  await db()
    .insert(l2ContractClassRegistered)
    .values({
      block_hash,
      ...contractClass,
    })
    .onConflictDoNothing();
};
