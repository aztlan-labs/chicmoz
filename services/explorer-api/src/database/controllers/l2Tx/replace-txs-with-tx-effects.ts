import { type ChicmozL2PendingTx } from "@chicmoz-pkg/types";
import { eq } from "drizzle-orm";
import { getDb as db } from "../../../database/index.js";
import { l2Tx } from "../../../database/schema/l2tx/index.js";

export const replaceTxsWithTxEffects = async (
  txHashes: ChicmozL2PendingTx["hash"][]
): Promise<void> => {
  return await db().transaction(async (dbTx) => {
    for (const txHash of txHashes) {
      const tx = await dbTx
        .delete(l2Tx)
        .where(eq(l2Tx.hash, txHash))
        .returning();
      if (!tx) continue;
      if (tx[0]?.birthTime) {
        await dbTx
          .update(l2Tx)
          .set({
            birthTime: tx[0].birthTime,
          })
          .where(eq(l2Tx.hash, txHash));
      }
    }
  });
};
