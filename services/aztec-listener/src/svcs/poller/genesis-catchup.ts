import { NODE_ENV, NodeEnv } from "@chicmoz-pkg/types";
import { onCatchupBlock } from "../../events/emitted/index.js";
import { logger } from "../../logger.js";
import { getBlock } from "./network-client.js";

const ARTIFICIAL_WAIT = 1000;

export const startCatchup = async ({
  from,
  to,
}: {
  from: number;
  to: number;
}) => {
  logger.info(`🐨 starting catchup from ${from} to ${to - 1}`);
  for (let i = from; i < to; i++) {
    const blockRes = await getBlock(i);
    if (!blockRes) throw new Error("FATAL: Catchup received no block.");
    logger.info(`🐨 publishing block ${i} (stopping at ${to - 1})`);
    await onCatchupBlock(blockRes);
    if (NODE_ENV === NodeEnv.DEV) {
      // NOTE: we are restarting our local cluster quiet often, so we shouldn't spam them unnecessarily
      await new Promise((resolve) => setTimeout(resolve, ARTIFICIAL_WAIT));
    }
  }
};
