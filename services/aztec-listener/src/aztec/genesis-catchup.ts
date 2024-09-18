import { NODE_ENV } from "../constants.js";
import { onCatchupBlock } from "../event-handler/index.js";
import { logger } from "../logger.js";
import { getBlock } from "./network-client.js";

export const startCatchup = async ({
  from,
  to,
}: {
  from: number;
  to: number;
}) => {
  logger.info("Starting genesis catchup...");
  for (let i = from; i < to; i++) {
    const blockRes = await getBlock(i);
    if (!blockRes) throw new Error("FATAL: Catchup received no block.");
    logger.info(`🐨 publishing block ${i} (stopping at ${to-1})`);
    await onCatchupBlock(blockRes);
    if (NODE_ENV === "development") {
      // NOTE: we are restarting our local cluster quiet often, so we shouldn't spam them unnecessarily
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
};
