import {
  ChicmozL1L2Validator,
  chicmozL1L2ValidatorSchema,
} from "@chicmoz-pkg/types";
import { SQL, eq, desc, getTableColumns, max, sql } from "drizzle-orm";
import { getDb as db } from "../../../index.js";
import {
  l1L2ValidatorTable,
  l1L2ValidatorStakeTable,
  l1L2ValidatorStatusTable,
  l1L2ValidatorWithdrawerTable,
  l1L2ValidatorProposerTable,
} from "../../../schema/l1/l2-validator.js";

export async function getAllL1L2Validators(): Promise<ChicmozL1L2Validator[]> {
  return getL1L2ValidatorDynamicWhere();
}

async function getL1L2ValidatorDynamicWhere(
  whereMatcher: SQL<unknown> | undefined = undefined
): Promise<ChicmozL1L2Validator[]> {
  const result = await db()
    .select({
      ...getTableColumns(l1L2ValidatorTable),
      stake: l1L2ValidatorStakeTable.stake,
      status: l1L2ValidatorStatusTable.status,
      withdrawer: l1L2ValidatorWithdrawerTable.withdrawer,
      proposer: l1L2ValidatorProposerTable.proposer,
      latestSeenChangeAt: max(sql`COALESCE(
        ${l1L2ValidatorStakeTable.timestamp},
        ${l1L2ValidatorStatusTable.timestamp},
        ${l1L2ValidatorWithdrawerTable.timestamp},
        ${l1L2ValidatorProposerTable.timestamp},
      )`),
    })
    .from(l1L2ValidatorTable)
    .leftJoin(
      l1L2ValidatorStakeTable,
      eq(l1L2ValidatorTable.attester, l1L2ValidatorStakeTable.attesterAddress)
    )
    .leftJoin(
      l1L2ValidatorStatusTable,
      eq(l1L2ValidatorTable.attester, l1L2ValidatorStatusTable.attesterAddress)
    )
    .leftJoin(
      l1L2ValidatorWithdrawerTable,
      eq(
        l1L2ValidatorTable.attester,
        l1L2ValidatorWithdrawerTable.attesterAddress
      )
    )
    .leftJoin(
      l1L2ValidatorProposerTable,
      eq(
        l1L2ValidatorTable.attester,
        l1L2ValidatorProposerTable.attesterAddress
      )
    )
    .where(whereMatcher)
    .groupBy(l1L2ValidatorTable.attester)
    .orderBy(desc(l1L2ValidatorStakeTable.stake))
    .execute();

  return result.map((row) =>
    chicmozL1L2ValidatorSchema.parse({
      ...row,
      stake: row.stake ? BigInt(row.stake) : BigInt(0),
    })
  );
}
