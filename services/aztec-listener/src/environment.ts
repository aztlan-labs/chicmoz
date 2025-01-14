export const BLOCK_POLL_INTERVAL_MS = Number(process.env.BLOCK_INTERVAL_MS) || 3000;
export const TX_POLL_INTERVAL_MS = Number(process.env.TX_POLL_INTERVAL_MS) || 500;
export const MAX_BATCH_SIZE_FETCH_MISSED_BLOCKS = Number(process.env.MAX_BATCH_SIZE_FETCH_MISSED_BLOCKS) || 50;
export const AZTEC_LISTEN_FOR_BLOCKS = process.env.AZTEC_LISTEN_FOR_BLOCKS === "true";
export const AZTEC_LISTEN_FOR_PENDING_TXS = process.env.AZTEC_LISTEN_FOR_PENDING_TXS === "true";
export const AZTEC_GENESIS_CATCHUP = process.env.AZTEC_GENESIS_CATCHUP === "true";
export const AZTEC_DISABLED = process.env.AZTEC_DISABLED === "true";

export const AZTEC_RPC_URL = process.env.AZTEC_RPC_URL ?? "http://localhost:8080";
export const CHAIN_NAME = process.env.CHAIN_NAME ?? "";
export const NETWORK_NAME = process.env.NETWORK_NAME ?? "";

export const IGNORE_PROCESSED_HEIGHT = process.env.IGNORE_PROCESSED_HEIGHT === "true";

export const NETWORK_ID = `${CHAIN_NAME}_${NETWORK_NAME}`;

export const getConfigStr = () => `POLLER\n${JSON.stringify({
  BLOCK_POLL_INTERVAL_MS,
  TX_POLL_INTERVAL_MS,
  MAX_BATCH_SIZE_FETCH_MISSED_BLOCKS,
  AZTEC_LISTEN_FOR_BLOCKS,
  AZTEC_LISTEN_FOR_PENDING_TXS,
  AZTEC_GENESIS_CATCHUP,
  AZTEC_DISABLED,
  AZTEC_RPC_URL,
  CHAIN_NAME,
  NETWORK_NAME,
  IGNORE_PROCESSED_HEIGHT,
  NETWORK_ID,
})}`;
