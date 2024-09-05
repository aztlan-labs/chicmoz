import { CHAIN_NAME } from "./constants.js";

export const PORT = Number(process.env.PORT) || 5000;
export const BODY_LIMIT = process.env.BODY_LIMIT ?? "64kb";
export const PARAMETER_LIMIT = Number(process.env.PARAMETER_LIMIT) || 100;
export const NODE_ENV = process.env.NODE_ENV ?? "development";

export const NETWORK_NAME = process.env.NETWORK_NAME ?? "SANDBOX";

export const KAFKA_CONNECTION_URL =
  process.env.KAFKA_CONNECTION_URL ?? "kafka:9092";
export const KAFKA_SASL_USERNAME =
  process.env.KAFKA_SASL_USERNAME ?? "controller_user";
export const KAFKA_SASL_PASSWORD = process.env.KAFKA_SASL_PASSWORD ?? "test";
export const KAFKA_MSK_ACCESS_KEY =
  process.env.KAFKA_MSK_ACCESS_KEY ?? "accessKey";
export const KAFKA_MSK_SECRET_KEY =
  process.env.KAFKA_MSK_SECRET_KEY ?? "secretKey";
export const KAFKA_MSK_USER_ID = process.env.KAFKA_MSK_USER_ID ?? "userId";
export const KAFKA_MSK_REGION = process.env.KAFKA_MSK_REGION ?? "local";

export const POSTGRES_IP = process.env.POSTGRES_IP ?? "localhost";
export const POSTGRES_PORT = Number(process.env.POSTGRES_PORT) || 5432;
export const POSTGRES_DB_NAME = process.env.POSTGRES_DB_NAME ?? "explorer-api";
export const POSTGRES_ADMIN = process.env.POSTGRES_ADMIN ?? "admin";
export const POSTGRES_PASSWORD =
  process.env.POSTGRES_PASSWORD ?? "secret-local-password";

export const ENABLE_CONSUMED_CAPACITY_TRACKING =
  process.env.ENABLE_CONSUMED_CAPACITY_TRACKING === "true";
export const BLOCK_DB_VALIDATION_ENABLED =
  process.env.BLOCK_DB_VALIDATION_ENABLED === "true";
export const BLOCK_INTERVAL_MS = Number(process.env.BLOCK_INTERVAL_MS) || 2000;
export const BLOCK_DB_VALIDATION_INTERVAL =
  Number(process.env.BLOCK_DB_VALIDATION_INTERVAL) || 50;
export const BLOCK_BD_VALIDATION_OFFSET =
  Number(process.env.BLOCK_DB_VALIDATION_OFFSET) || 50;

export const MAXIMUM_LIST_SIZE = 1000;
export const UPDATE_VALIDATOR_MAPPING =
  process.env.UPDATE_VALIDATOR_MAPPING === "true";

export const NETWORK_ID = `${CHAIN_NAME}_${NETWORK_NAME}`;

export const dbCredentials = {
  host: POSTGRES_IP,
  port: POSTGRES_PORT,
  user: POSTGRES_ADMIN,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB_NAME,
};
