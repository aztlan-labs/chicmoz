import { ChicmozL1L2Validator } from "@chicmoz-pkg/types";
import { getDb as db } from "../../../index.js";
import {
  l1L2ValidatorProposerTable,
  l1L2ValidatorStakeTable,
  l1L2ValidatorStatusTable,
  l1L2ValidatorTable,
  l1L2ValidatorWithdrawerTable,
} from "../../../schema/l1/l2-validator.js";

export async function storeL1L2Validator(
  validator: ChicmozL1L2Validator
): Promise<void> {
  const {
    attester,
    firstSeenAt,
    stake,
    status,
    withdrawer,
    proposer,
  } = validator;

  await db().transaction(async (tx) => {
    await tx
      .insert(l1L2ValidatorTable)
      .values({ attester, firstSeenAt })
      .onConflictDoNothing();

    await tx.insert(l1L2ValidatorStakeTable).values({
      attesterAddress: attester,
      stake: stake.toString(),
    });

    await tx.insert(l1L2ValidatorStatusTable).values({
      attesterAddress: attester,
      status,
    });

    await tx.insert(l1L2ValidatorWithdrawerTable).values({
      attesterAddress: attester,
      withdrawer,
    });

    await tx.insert(l1L2ValidatorProposerTable).values({
      attesterAddress: attester,
      proposer,
    });
  });
}
