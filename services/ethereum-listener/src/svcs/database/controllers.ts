import { getDb as db } from "@chicmoz-pkg/postgres-helper";
import {
  L1ContractAddresses,
  L1ContractAddressesSchema,
} from "@chicmoz-pkg/types";
import { eq, getTableColumns } from "drizzle-orm";
import { L2_NETWORK_ID } from "../../environment.js";
import {
  finalizedHeightTable,
  l1ContractAddressesTable,
  pendingHeightTable,
} from "./schema.js";

export async function getPendingHeight() {
  const result = await db()
    .select(getTableColumns(pendingHeightTable))
    .from(pendingHeightTable)
    .where(eq(pendingHeightTable.networkId, L2_NETWORK_ID))
    .limit(1);
  if (!result.length || result[0].latestHeight === null)
    throw new Error("Pending height not initialized");
  return result[0].latestHeight;
}

export async function getFinalizedHeight() {
  const result = await db()
    .select(getTableColumns(finalizedHeightTable))
    .from(finalizedHeightTable)
    .where(eq(finalizedHeightTable.networkId, L2_NETWORK_ID))
    .limit(1);
  if (!result.length || result[0].latestHeight === null)
    throw new Error("Finalized height not initialized");
  return result[0].latestHeight;
}

export async function setPendingHeight(height: bigint) {
  await db()
    .update(pendingHeightTable)
    .set({ latestHeight: height, lastUpdated: new Date() })
    .where(eq(pendingHeightTable.networkId, L2_NETWORK_ID));
}

export async function setFinalizedHeight(height: bigint) {
  await db()
    .update(finalizedHeightTable)
    .set({ latestHeight: height, lastUpdated: new Date() })
    .where(eq(finalizedHeightTable.networkId, L2_NETWORK_ID));
}

export async function ensureInitializedBlockHeights() {
  await Promise.all([
    db()
      .insert(pendingHeightTable)
      .values({
        latestHeight: 0n,
        networkId: L2_NETWORK_ID,
      })
      .onConflictDoNothing(),
    db()
      .insert(finalizedHeightTable)
      .values({
        latestHeight: 0n,
        networkId: L2_NETWORK_ID,
      })
      .onConflictDoNothing(),
  ]);
}

export async function getL1Contracts() {
  const res = await db()
    .select(getTableColumns(l1ContractAddressesTable))
    .from(l1ContractAddressesTable)
    .where(eq(l1ContractAddressesTable.networkId, L2_NETWORK_ID))
    .limit(1);
  if (!res.length || !res[0].addresses)
    throw new Error("L1 contracts not initialized");
  return L1ContractAddressesSchema.parse(res[0].addresses);
}

export async function storeL1ContractAddresses(addresses: L1ContractAddresses) {
  await db()
    .insert(l1ContractAddressesTable)
    .values({
      addresses,
      networkId: L2_NETWORK_ID,
    })
    .onConflictDoUpdate({
      target: l1ContractAddressesTable.networkId,
      set: {
        addresses,
        lastUpdated: new Date(),
      },
    });
}
