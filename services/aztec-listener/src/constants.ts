export const BLOCK_POLL_INTERVAL_MS = Number(process.env.BLOCK_INTERVAL_MS) || 3000;
export const TX_POLL_INTERVAL_MS = Number(process.env.TX_POLL_INTERVAL_MS) || 500;
export const MAX_BATCH_SIZE_FETCH_MISSED_BLOCKS = Number(process.env.MAX_BATCH_SIZE_FETCH_MISSED_BLOCKS) || 50;
export const AZTEC_LISTEN_FOR_BLOCKS = process.env.AZTEC_LISTEN_FOR_BLOCKS === "true";
export const AZTEC_LISTEN_FOR_PENDING_TXS = process.env.AZTEC_LISTEN_FOR_PENDING_TXS === "true";
export const AZTEC_GENESIS_CATCHUP = process.env.AZTEC_GENESIS_CATCHUP === "true";
export const AZTEC_DISABLED = process.env.AZTEC_DISABLED === "true";

export const NODE_ENV = process.env.NODE_ENV ?? "development";

export const AZTEC_RPC_URL = process.env.AZTEC_RPC_URL ?? "http://localhost:8080";
export const CHAIN_NAME = process.env.CHAIN_NAME ?? "";
export const NETWORK_NAME = process.env.NETWORK_NAME ?? "";

export const KAFKA_CONNECTION = process.env.KAFKA_CONNECTION ?? "kafka:9092";
export const KAFKA_SASL_USERNAME = process.env.KAFKA_SASL_USERNAME ?? "controller_user";
export const KAFKA_SASL_PASSWORD = process.env.KAFKA_SASL_PASSWORD ?? "test";

export const POSTGRES_IP = process.env.POSTGRES_IP ?? "localhost";
export const POSTGRES_PORT = Number(process.env.POSTGRES_PORT) || 5432;
export const POSTGRES_DB_NAME = process.env.POSTGRES_DB_NAME ?? "aztec_listener";
export const POSTGRES_ADMIN = process.env.POSTGRES_ADMIN ?? "admin";
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD ?? "secret-local-password";

export const SERVICE_NAME = process.env.SERVICE_NAME ?? "aztec-listener";
export const INSTANCE_NAME = process.env.INSTANCE_NAME ?? "default";

export const IGNORE_PROCESSED_HEIGHT = process.env.IGNORE_PROCESSED_HEIGHT === "true";

export const NETWORK_ID = `${CHAIN_NAME}_${NETWORK_NAME}`;

export const dbCredentials = {
  host: POSTGRES_IP,
  port: POSTGRES_PORT,
  user: POSTGRES_ADMIN,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB_NAME,
};

export const logFriendlyConfig = {
  BLOCK_POLL_INTERVAL_MS,
  TX_POLL_INTERVAL_MS,
  MAX_BATCH_SIZE_FETCH_MISSED_BLOCKS,
  AZTEC_LISTEN_FOR_BLOCKS,
  AZTEC_LISTEN_FOR_PENDING_TXS,
  AZTEC_GENESIS_CATCHUP,
  AZTEC_DISABLED,
  NODE_ENV,
  AZTEC_RPC_URL,
  CHAIN_NAME,
  NETWORK_NAME,
  KAFKA_CONNECTION,
  KAFKA_SASL_USERNAME,
  POSTGRES_IP,
  POSTGRES_PORT,
  POSTGRES_DB_NAME,
  POSTGRES_ADMIN,
  SERVICE_NAME,
  INSTANCE_NAME,
  IGNORE_PROCESSED_HEIGHT,
  NETWORK_ID,
};
