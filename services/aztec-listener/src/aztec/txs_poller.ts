import { Tx } from "@aztec/aztec.js";
import { BLOCK_POLL_INTERVAL_MS } from "../constants.js";
import { getPendingTxs } from "./network-client.js";
import { onPendingTxs } from "../event-handler/index.js";

let pollInterval: NodeJS.Timeout;

export const startPolling = () => {
  pollInterval = setInterval(() => {
    void fetchAndPublishPendingTxs();
  }, BLOCK_POLL_INTERVAL_MS);
};

export const stopPolling = () => {
  if (pollInterval) clearInterval(pollInterval);
};

const internalOnPendingTxs = async (pendingTxs: Tx[]) => {
  await onPendingTxs(pendingTxs);
};

const fetchAndPublishPendingTxs = async () => {
  const txs = await getPendingTxs();
  await internalOnPendingTxs(txs);
};
