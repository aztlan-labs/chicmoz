export const BLOCK_POLL_INTERVAL_MS = Number(process.env.BLOCK_INTERVAL_MS) || 2000;
export const LISTEN_FOR_BLOCKS = process.env.LISTEN_FOR_BLOCKS === "true";
export const GENESIS_CATCHUP = process.env.GENESIS_CATCHUP === "true";
export const LISTENER_DISABLED = process.env.LISTENER_DISABLED === "true";

export const NODE_ENV = process.env.NODE_ENV ?? "development";

export const AZTEC_RPC_URL = process.env.ETHEREUM_RPC_URL ?? "http://anvil-ethereum-node:8545";
export const CHAIN_NAME = process.env.CHAIN_NAME ?? "ETHEREUM";
export const NETWORK_NAME = process.env.NETWORK_NAME ?? "LOCAL_SANDBOX";

export const KAFKA_CONNECTION = process.env.KAFKA_CONNECTION ?? "kafka:9092";
export const KAFKA_SASL_USERNAME = process.env.KAFKA_SASL_USERNAME ?? "controller_user";
export const KAFKA_SASL_PASSWORD = process.env.KAFKA_SASL_PASSWORD ?? "test";

export const SERVICE_NAME = process.env.SERVICE_NAME ?? "ethereum-listener";

export const IGNORE_PROCESSED_HEIGHT = process.env.IGNORE_PROCESSED_HEIGHT === "true";

export const NETWORK_ID = `${CHAIN_NAME}_${NETWORK_NAME}`;
