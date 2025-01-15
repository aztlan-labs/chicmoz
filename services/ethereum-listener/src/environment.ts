import {
  type L1NetworkId,
  type L2NetworkId,
  l1NetworkIdSchema,
  l2NetworkIdSchema,
} from "@chicmoz-pkg/types";

export const BLOCK_POLL_INTERVAL_MS =
  Number(process.env.BLOCK_INTERVAL_MS) || 500;
export const LISTEN_FOR_BLOCKS = process.env.LISTEN_FOR_BLOCKS === "true";
export const GENESIS_CATCHUP = process.env.GENESIS_CATCHUP === "true";
export const LISTENER_DISABLED = process.env.LISTENER_DISABLED === "true";

export const NODE_ENV = process.env.NODE_ENV ?? "development";

export const ETHEREUM_HTTP_RPC_URL =
  process.env.ETHEREUM_HTTP_RPC_URL ?? "http://anvil-ethereum-node:8545";
export const ETHEREUM_WS_RPC_URL =
  process.env.ETHEREUM_WS_RPC_URL ?? "ws://anvil-ethereum-node:8545";

export const KAFKA_CONNECTION = process.env.KAFKA_CONNECTION ?? "kafka:9092";
export const KAFKA_SASL_USERNAME =
  process.env.KAFKA_SASL_USERNAME ?? "controller_user";
export const KAFKA_SASL_PASSWORD = process.env.KAFKA_SASL_PASSWORD ?? "test";

export const SERVICE_NAME = process.env.SERVICE_NAME ?? "ethereum-listener";

export const L1_NETWORK_ID: L1NetworkId = l1NetworkIdSchema.parse(
  process.env.L1_NETWORK_ID
);
export const L2_NETWORK_ID: L2NetworkId = l2NetworkIdSchema.parse(
  process.env.L2_NETWORK_ID
);
