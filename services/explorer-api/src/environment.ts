export const NODE_ENV = process.env.NODE_ENV ?? "development";
import {
  CHAIN_NAME,
  DEFAULT_VERIFIED_CONTRACT_ADDRESSES_DEV,
  DEFAULT_VERIFIED_CONTRACT_ADDRESSES_PROD,
} from "./constants.js";

const verifiedContractAddresses =
  NODE_ENV === "production"
    ? DEFAULT_VERIFIED_CONTRACT_ADDRESSES_PROD
    : DEFAULT_VERIFIED_CONTRACT_ADDRESSES_DEV;

export const VERIFIED_CONTRACT_ADDRESSES = verifiedContractAddresses

export const PUBLIC_API_KEY =
  process.env.PUBLIC_API_KEY ?? "d1e2083a-660c-4314-a6f2-1d42f4b944f4";

export const CACHE_TTL_SECONDS = Number(process.env.CACHE_TTL) || 60;
export const CACHE_LATEST_TTL_SECONDS =
  Number(process.env.CACHE_LATEST_TTL) || 10;
export const REDIS_HOST = process.env.REDIS_HOST ?? "redis-master";
export const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;

export const PORT = Number(process.env.PORT) || 5000;
export const BODY_LIMIT = process.env.BODY_LIMIT ?? "64kb";
export const PARAMETER_LIMIT = Number(process.env.PARAMETER_LIMIT) || 100;

export const DB_MAX_BLOCKS = 20;
export const DB_MAX_TX_EFFECTS = 20;
export const DB_MAX_CONTRACTS = 20;

export const NETWORK_NAME = process.env.NETWORK_NAME ?? "SANDBOX";

export const KAFKA_CONNECTION_URL =
  process.env.KAFKA_CONNECTION_URL ?? "kafka:9092";
export const KAFKA_SASL_USERNAME =
  process.env.KAFKA_SASL_USERNAME ?? "controller_user";
export const KAFKA_SASL_PASSWORD = process.env.KAFKA_SASL_PASSWORD ?? "test";

export const POSTGRES_IP = process.env.POSTGRES_IP ?? "localhost";
export const POSTGRES_PORT = Number(process.env.POSTGRES_PORT) || 5432;
export const POSTGRES_DB_NAME = process.env.POSTGRES_DB_NAME ?? "explorer_api";
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
