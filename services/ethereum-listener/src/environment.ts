export const BLOCK_POLL_INTERVAL_MS = Number(process.env.BLOCK_INTERVAL_MS) || 500;
export const LISTEN_FOR_BLOCKS = process.env.LISTEN_FOR_BLOCKS === "true";
export const GENESIS_CATCHUP = process.env.GENESIS_CATCHUP === "true";
export const LISTENER_DISABLED = process.env.LISTENER_DISABLED === "true";

export const NODE_ENV = process.env.NODE_ENV ?? "development";

export const ETHEREUM_HTTP_RPC_URL = process.env.ETHEREUM_HTTP_RPC_URL ?? "http://anvil-ethereum-node:8545";
export const ETHEREUM_WS_RPC_URL = process.env.ETHEREUM_WS_RPC_URL ?? "ws://anvil-ethereum-node:8545";
export const AZTEC_CHAIN_NAME = process.env.AZTEC_CHAIN_NAME ?? "AZTEC";
export const AZTEC_NETWORK_NAME = process.env.AZTEC_NETWORK_NAME ?? "SANDBOX";
export const ETHEREUM_CHAIN_NAME = process.env.ETHEREUM_CHAIN_NAME ?? "HARDCODED_ETHEREUM";
export const ETHEREUM_NETWORK_ID = Number(process.env.ETHEREUM_NETWORK_NAME) || 99999;

export const KAFKA_CONNECTION = process.env.KAFKA_CONNECTION ?? "kafka:9092";
export const KAFKA_SASL_USERNAME = process.env.KAFKA_SASL_USERNAME ?? "controller_user";
export const KAFKA_SASL_PASSWORD = process.env.KAFKA_SASL_PASSWORD ?? "test";

export const SERVICE_NAME = process.env.SERVICE_NAME ?? "ethereum-listener";

export const AZTEC_NETWORK_ID = `${AZTEC_CHAIN_NAME}_${AZTEC_NETWORK_NAME}`;
