import { EthAddress, L1L2ValidatorStatus } from "@chicmoz-pkg/types";
import { eq, desc, sql } from "drizzle-orm";
import { getDb as db } from "../../../index.js";
import {
  l1L2ValidatorStakeTable,
  l1L2ValidatorStatusTable,
  l1L2ValidatorWithdrawerTable,
  l1L2ValidatorProposerTable,
} from "../../../schema/l1/l2-validator.js";

export async function getL1L2ValidatorHistory(
  attesterAddress: EthAddress
): Promise<[Date, string, string][]> {
  const result = await db()
    .select({
      timestamp: l1L2ValidatorStakeTable.timestamp,
      keyChanged: sql<string>`'stake'`,
      newValue: sql<string>`CAST(${l1L2ValidatorStakeTable.stake} AS TEXT)`,
    })
    .from(l1L2ValidatorStakeTable)
    .where(eq(l1L2ValidatorStakeTable.attesterAddress, attesterAddress))
    .union(
      db()
        .select({
          timestamp: l1L2ValidatorStatusTable.timestamp,
          keyChanged: sql<string>`'status'`,
          newValue: sql<string>`CAST(${l1L2ValidatorStatusTable.status} AS TEXT)`,
        })
        .from(l1L2ValidatorStatusTable)
        .where(eq(l1L2ValidatorStatusTable.attesterAddress, attesterAddress))
    )
    .union(
      db()
        .select({
          timestamp: l1L2ValidatorWithdrawerTable.timestamp,
          keyChanged: sql<string>`'withdrawer'`,
          newValue: l1L2ValidatorWithdrawerTable.withdrawer,
        })
        .from(l1L2ValidatorWithdrawerTable)
        .where(
          eq(l1L2ValidatorWithdrawerTable.attesterAddress, attesterAddress)
        )
    )
    .union(
      db()
        .select({
          timestamp: l1L2ValidatorProposerTable.timestamp,
          keyChanged: sql<string>`'proposer'`,
          newValue: l1L2ValidatorProposerTable.proposer,
        })
        .from(l1L2ValidatorProposerTable)
        .where(eq(l1L2ValidatorProposerTable.attesterAddress, attesterAddress))
    )
    .orderBy(desc(sql`timestamp`))
    .execute();

  return result.map(({ timestamp, keyChanged, newValue }) => [
    new Date(timestamp),
    keyChanged,
    keyChanged === "status"
      ? (Number(newValue) as unknown as keyof typeof L1L2ValidatorStatus) || newValue
      : newValue,
  ]);
}
