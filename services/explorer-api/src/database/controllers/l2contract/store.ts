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
): Promise<void> => {

  await db()
    .insert(l2ContractInstanceDeployed)
    .values({
      ...instance,
    })
    .onConflictDoNothing();
};
export const storeContractClass = async (
  contractClass: ChicmozL2ContractClassRegisteredEvent,
): Promise<void> => {

  await db()
    .insert(l2ContractClassRegistered)
    .values({
      ...contractClass,
    })
    .onConflictDoNothing();
};
