import { ChicmozL2PendingTx } from "@chicmoz-pkg/types";
import { eq } from "drizzle-orm";
import { getDb as db } from "../../../database/index.js";
import { l2Tx } from "../../schema/index.js";

export const deleteTx = async (
  hash: ChicmozL2PendingTx["hash"]
): Promise<void> => {
  await db().delete(l2Tx).where(eq(l2Tx.hash, hash)).execute();
};
