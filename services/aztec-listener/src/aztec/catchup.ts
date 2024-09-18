import { NODE_ENV } from "../constants.js";
import { onBlock } from "../event-handler/index.js";
import { logger } from "../logger.js";
import { getBlock } from "./network-client.js";

export const startCatchup = async ({
  from,
  to,
}: {
  from: number;
  to: number;
}) => {
  for (let i = from; i < to; i++) {
    const blockRes = await getBlock(i);
    if (!blockRes) throw new Error("FATAL: Catchup received no block.");

    logger.info(`🐨 publishing block ${i} (of total ${to - from + 1})...`);
    await onBlock(blockRes);
    if (NODE_ENV === "development") {
      // NOTE: if we are restarting locally often we shouln't spam their RPC
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
};
