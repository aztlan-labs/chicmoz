import { CHAIN_NAME } from "./constants.js";

const DEFAULT_VERIFIED_CONTRACT_ADDRESSES = [
  "0x11a81043f8c2cb2e95fa28e051f042a87e76c9e42d442188638eb2c07ae445b2",
  "0x17eafcd0961cc68c56b79305fa6fa8ee49bf8185b2bff279be84f3ceb1ae03ec",
  "0x12fb76c6e2ccbad0919c554c07257fc69993ddd9c799c62179345b5b82a95dd8",
];
const verifiedContractAddresses = process.env.VERIFIED_CONTRACT_ADDRESSES;

const isValidVerifiedContractAddresses = verifiedContractAddresses
  ?.split(",")
  .every((address) => {
    return address.length === 66 && address.startsWith("0x");
  });
if (verifiedContractAddresses && !isValidVerifiedContractAddresses)
  throw new Error("Invalid VERIFIED_CONTRACT_ADDRESSES");

export const VERIFIED_CONTRACT_ADDRESSES = verifiedContractAddresses
  ? verifiedContractAddresses.split(",")
  : DEFAULT_VERIFIED_CONTRACT_ADDRESSES;

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
export const NODE_ENV = process.env.NODE_ENV ?? "development";

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
