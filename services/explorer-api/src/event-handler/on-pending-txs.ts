import { PendingTxsEvent } from "@chicmoz-pkg/message-registry";
import { chicmozL2PendingTxSchema } from "@chicmoz-pkg/types";
import { logger } from "../logger.js";
import { storeL2Tx } from "../database/controllers/l2Tx/store.js";
import { handleDuplicateError } from "./utils.js";
import { getTxs } from "../database/controllers/l2Tx/get-tx.js";
import { deleteTx } from "../database/controllers/l2Tx/delete.js";

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
