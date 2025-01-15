import {
  chicmozL2PendingTxSchema,
  type ChicmozL2PendingTx,
} from "@chicmoz-pkg/types";
import { asc, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { getDb as db } from "@chicmoz-pkg/postgres-helper";
import { l2Tx } from "../../../database/schema/l2tx/index.js";

export const getTxs = async (): Promise<ChicmozL2PendingTx[]> => {
  const res = await db()
    .select({
      ...getTableColumns(l2Tx),
    })
    .from(l2Tx)
    .orderBy(asc(l2Tx.birthTimestamp));
  if (!res) return [];
  return z.array(chicmozL2PendingTxSchema).parse(
    res.map((tx) => ({
      ...tx,
      birthTimestamp: tx.birthTimestamp.getTime(),
    }))
  );
};
