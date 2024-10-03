import { CHAIN_NAME } from "./constants.js";

export const PUBLIC_API_KEY = process.env.PUBLIC_API_KEY ?? "d1e2083a-660c-4314-a6f2-1d42f4b944f4";

export const PORT = Number(process.env.PORT) || 5000;
export const BODY_LIMIT = process.env.BODY_LIMIT ?? "64kb";
export const PARAMETER_LIMIT = Number(process.env.PARAMETER_LIMIT) || 100;
export const NODE_ENV = process.env.NODE_ENV ?? "development";

export const DB_MAX_BLOCKS = 20;

export const NETWORK_NAME = process.env.NETWORK_NAME ?? "SANDBOX";

export const KAFKA_CONNECTION_URL =
  process.env.KAFKA_CONNECTION_URL ?? "kafka:9092";
export const KAFKA_SASL_USERNAME =
  process.env.KAFKA_SASL_USERNAME ?? "controller_user";
export const KAFKA_SASL_PASSWORD = process.env.KAFKA_SASL_PASSWORD ?? "test";

export const POSTGRES_IP = process.env.POSTGRES_IP ?? "localhost";
export const POSTGRES_PORT = Number(process.env.POSTGRES_PORT) || 5432;
export const POSTGRES_DB_NAME = process.env.POSTGRES_DB_NAME ?? "explorer-api";
export const POSTGRES_ADMIN = process.env.POSTGRES_ADMIN ?? "admin";
export const POSTGRES_PASSWORD =
  process.env.POSTGRES_PASSWORD ?? "secret-local-password";

export const NETWORK_ID = `${CHAIN_NAME}_${NETWORK_NAME}`;

export const dbCredentials = {
  host: POSTGRES_IP,
  port: POSTGRES_PORT,
  user: POSTGRES_ADMIN,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB_NAME,
};
