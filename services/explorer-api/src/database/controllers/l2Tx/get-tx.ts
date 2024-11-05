import {
  chicmozL2PendingTxSchema,
  type ChicmozL2PendingTx,
} from "@chicmoz-pkg/types";
import { asc, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { getDb as db } from "../../../database/index.js";
import { l2Tx } from "../../../database/schema/l2tx/index.js";

export const getTxs = async (): Promise<ChicmozL2PendingTx[]> => {
  const res = await db()
    .select({
      ...getTableColumns(l2Tx),
    })
    .from(l2Tx)
    .orderBy(asc(l2Tx.birthTime));
  if (!res) return [];
  return z.array(chicmozL2PendingTxSchema).parse(res);
};
