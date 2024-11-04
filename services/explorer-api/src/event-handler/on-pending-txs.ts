import { PendingTxsEvent } from "@chicmoz-pkg/message-registry";
import { chicmozL2PendingTxSchema } from "@chicmoz-pkg/types";
import { logger } from "../logger.js";
import { storeL2Tx } from "../database/controllers/l2contract/store.js";

export const onPendingTxs = async ({ txs }: PendingTxsEvent) => {
  for (const tx of txs) {
    logger.info(`🔗 Pending tx: ${tx.hash}`);
    const res = chicmozL2PendingTxSchema.parse(tx);
    await storeL2Tx(res);
  }
};
