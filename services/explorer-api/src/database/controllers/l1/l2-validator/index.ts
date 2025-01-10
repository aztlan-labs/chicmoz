import {
  ChicmozL1L2Validator,
  EthAddress,
  chicmozL1L2ValidatorSchema,
} from "@chicmoz-pkg/types";
import { eq } from "drizzle-orm";
import { getDb as db } from "../../../index.js";
import { l1L2ValidatorTable } from "../../../schema/l1/l2-validator.js";

// TODO: (the other) file and queries should be changed from validators to "feeRecipients" or "feeReceivers"

export async function storeL1L2Validator(
  validator: ChicmozL1L2Validator
): Promise<void> {
  await db()
    .insert(l1L2ValidatorTable)
    .values({
      ...validator,
      stake: validator.stake.toString(),
    })
    .onConflictDoUpdate({
      target: l1L2ValidatorTable.attester,
      set: {
        stake: validator.stake.toString(),
        withdrawer: validator.withdrawer,
        proposer: validator.proposer,
        status: validator.status,
        latestSeenChangeAt: validator.latestSeenChangeAt,
      },
    });
}

export async function getL1L2Validator(
  attesterAddress: EthAddress
): Promise<ChicmozL1L2Validator | null> {
  const result = await db()
    .select()
    .from(l1L2ValidatorTable)
    .where(eq(l1L2ValidatorTable.attester, attesterAddress))
    .limit(1);

  if (result.length === 0) return null;

  return chicmozL1L2ValidatorSchema.parse(result[0]);
}

export async function getAllL1L2Validators(): Promise<ChicmozL1L2Validator[]> {
  const result = await db()
    .select()
    .from(l1L2ValidatorTable)
    .execute();

  return result.map((r) => chicmozL1L2ValidatorSchema.parse(r));
}
