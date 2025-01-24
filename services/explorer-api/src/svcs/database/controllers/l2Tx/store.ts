import { type ChicmozL2PendingTx } from "@chicmoz-pkg/types";
import { getDb as db } from "@chicmoz-pkg/postgres-helper";
import { l2Tx } from "../../schema/l2tx/index.js";

export const storeL2Tx = async (tx: ChicmozL2PendingTx): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { birthTimestamp, ...rest } = tx;
  await db()
    .insert(l2Tx)
    .values({
      ...rest,
    }).onConflictDoNothing();
};
