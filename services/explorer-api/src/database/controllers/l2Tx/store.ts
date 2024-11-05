import { type ChicmozL2PendingTx } from "@chicmoz-pkg/types";
import { getDb as db } from "../../../database/index.js";
import { l2Tx } from "../../schema/l2tx/index.js";

export const storeL2Tx = async (tx: ChicmozL2PendingTx): Promise<void> => {
  await db()
    .insert(l2Tx)
    .values({
      ...tx,
    });
};
