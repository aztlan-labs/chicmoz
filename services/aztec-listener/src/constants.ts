// TODO: rename BLOCK_INTERVAL_MS to BLOCK_POLL_INTERVAL_MS
export const BLOCK_INTERVAL_MS = Number(process.env.BLOCK_INTERVAL_MS) || 2000;
export const MAX_BATCH_SIZE_FETCH_MISSED_BLOCKS = Number(process.env.MAX_BATCH_SIZE_FETCH_MISSED_BLOCKS) || 50;
export const LISTEN_FOR_BLOCKS = process.env.LISTEN_FOR_BLOCKS === "true";
export const CATCHUP_ENABLED = process.env.CATCHUP_ENABLED === "true";
export const DISABLE_AZTEC = process.env.DISABLE_AZTEC === "true";

export const CATCHUP_START = Number(process.env.CATCHUP_START) || undefined;
export const CATCHUP_END = Number(process.env.CATCHUP_END) || undefined;
export const NODE_ENV = process.env.NODE_ENV ?? "development";

export const AZTEC_RPC = process.env.AZTEC_RPC ?? "http://localhost:8080";
export const CHAIN_NAME = process.env.CHAIN_NAME ?? "";
export const NETWORK_NAME = process.env.NETWORK_NAME ?? "";

export const KAFKA_CONNECTION = process.env.KAFKA_CONNECTION ?? "kafka:9092";
export const KAFKA_SASL_USERNAME = process.env.KAFKA_SASL_USERNAME ?? "controller_user";
export const KAFKA_SASL_PASSWORD = process.env.KAFKA_SASL_PASSWORD ?? "test";
export const KAFKA_MSK_ACCESS_KEY = process.env.KAFKA_MSK_ACCESS_KEY ?? "accessKey";
export const KAFKA_MSK_SECRET_KEY = process.env.KAFKA_MSK_SECRET_KEY ?? "secretKey";
export const KAFKA_MSK_USER_ID = process.env.KAFKA_MSK_USER_ID ?? "userId";
export const KAFKA_MSK_REGION = process.env.KAFKA_MSK_REGION ?? "local";

export const POSTGRES_IP = process.env.POSTGRES_IP ?? "localhost";
export const POSTGRES_PORT = Number(process.env.POSTGRES_PORT) || 5432;
export const POSTGRES_DB_NAME = process.env.POSTGRES_DB_NAME ?? "aztec_listener";
export const POSTGRES_ADMIN = process.env.POSTGRES_ADMIN ?? "admin";
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD ?? "secret-local-password";

export const SERVICE_NAME = process.env.SERVICE_NAME ?? `aztec-listener`;

export const IGNORE_PROCESSED_HEIGHT = process.env.IGNORE_PROCESSED_HEIGHT === "true";

export const NETWORK_ID = `${CHAIN_NAME}_${NETWORK_NAME}`;

export const dbCredentials = {
  host: POSTGRES_IP,
  port: POSTGRES_PORT,
  user: POSTGRES_ADMIN,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB_NAME,
};
