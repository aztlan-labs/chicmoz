import { PendingTxsEvent } from "@chicmoz-pkg/message-registry";
import { chicmozL2PendingTxSchema } from "@chicmoz-pkg/types";
import { logger } from "../../logger.js";
import {
  deleteTx,
  getTxs,
  storeL2Tx,
} from "../../svcs/database/controllers/l2Tx/index.js";
import { handleDuplicateError } from "./utils.js";

export const onPendingTxs = async ({ txs }: PendingTxsEvent) => {
  const dbTxs = await getTxs();
  const staleTxs = dbTxs.filter(
    (dbTx) => !txs.some((tx) => tx.hash === dbTx.hash)
  );
  for (const tx of txs) {
    logger.info(`🕐 Pending tx: ${tx.hash}`);
    const res = chicmozL2PendingTxSchema.parse(tx);
    await storeL2Tx(res).catch((e) => {
      handleDuplicateError(e as Error, `tx ${res.hash}`);
    });
  }
  if (staleTxs.length > 0) {
    logger.info(`🕐🕐🕐 Stale txs: ${staleTxs.length}. Deleting...`);
    for (const tx of staleTxs) await deleteTx(tx.hash);
  }
};
