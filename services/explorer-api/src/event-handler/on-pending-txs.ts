import { PendingTxsEvent } from "@chicmoz-pkg/message-registry";
import { chicmozL2PendingTxSchema } from "@chicmoz-pkg/types";
import { logger } from "../logger.js";

// eslint-disable-next-line @typescript-eslint/require-await
export const onPendingTxs = async ({ txs }: PendingTxsEvent) => {
  logger.info(`🔗 Pending txs: ${txs.length}`);
  for (const tx of txs) {
    const res = chicmozL2PendingTxSchema.parse(tx);
    logger.info(res.hash);
  }
};
