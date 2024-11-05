import { type ChicmozL2PendingTx } from "@chicmoz-pkg/types";
import { getDb as db } from "../../../database/index.js";
import { l2Tx } from "../../schema/l2tx/index.js";
import { getTxs } from "./get-tx.js";
import { logger } from "../../../logger.js";

export const storeL2Tx = async (tx: ChicmozL2PendingTx): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { birthTimestamp, ...rest } = tx;
  await db()
    .insert(l2Tx)
    .values({
      ...rest,
    });

  const test = await getTxs();

  test.forEach((tx) => {
    logger.info(`🕐 Pending tx: ${tx.hash}`);
    logger.info(`🕐 Pending tx: ${tx.birthTimestamp}`);
  });
};
