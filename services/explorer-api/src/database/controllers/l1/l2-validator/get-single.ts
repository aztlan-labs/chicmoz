import {
  ChicmozL1L2Validator,
  EthAddress,
  chicmozL1L2ValidatorSchema,
} from "@chicmoz-pkg/types";
import { SQL, desc, eq, getTableColumns } from "drizzle-orm";
import { getDb as db } from "../../../index.js";
import {
  l1L2ValidatorProposerTable,
  l1L2ValidatorStakeTable,
  l1L2ValidatorStatusTable,
  l1L2ValidatorTable,
  l1L2ValidatorWithdrawerTable,
} from "../../../schema/l1/l2-validator.js";

export async function getL1L2Validator(
  attesterAddress: EthAddress
): Promise<ChicmozL1L2Validator | null> {
  return getL1L2ValidatorDynamicWhere(eq(l1L2ValidatorTable.attester, attesterAddress));
}

async function getL1L2ValidatorDynamicWhere(
  whereMatcher: SQL<unknown>
): Promise<ChicmozL1L2Validator | null> {
  const result = await db()
    .select({
      ...getTableColumns(l1L2ValidatorTable),
      stake: l1L2ValidatorStakeTable.stake,
      status: l1L2ValidatorStatusTable.status,
      withdrawer: l1L2ValidatorWithdrawerTable.withdrawer,
      proposer: l1L2ValidatorProposerTable.proposer,
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
    .orderBy(
      desc(l1L2ValidatorStakeTable.timestamp),
      desc(l1L2ValidatorStatusTable.timestamp),
      desc(l1L2ValidatorWithdrawerTable.timestamp),
      desc(l1L2ValidatorProposerTable.timestamp)
    )
    .limit(1)
    .execute();

  if (result.length === 0) return null;

  return chicmozL1L2ValidatorSchema.parse({
    ...result[0],
    stake: result[0].stake ? BigInt(result[0].stake) : BigInt(0),
  });
}
