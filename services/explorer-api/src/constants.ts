export const PORT = Number(process.env.PORT) || 5000;
export const BODY_LIMIT = process.env.BODY_LIMIT ?? "64kb";
export const PARAMETER_LIMIT = Number(process.env.PARAMETER_LIMIT) || 100;
export const NODE_ENV = process.env.NODE_ENV ?? "development";

export const CHAIN_NAME = "AZTEC";
export const NETWORK_NAME = process.env.NETWORK_NAME ?? "SANDBOX";

export const KAFKA_CONNECTION = process.env.KAFKA_CONNECTION ?? "kafka:9092";
export const KAFKA_SASL_USERNAME = process.env.KAFKA_SASL_USERNAME ?? "controller_user";
export const KAFKA_SASL_PASSWORD = process.env.KAFKA_SASL_PASSWORD ?? "test";
export const KAFKA_MSK_ACCESS_KEY = process.env.KAFKA_MSK_ACCESS_KEY ?? "accessKey";
export const KAFKA_MSK_SECRET_KEY = process.env.KAFKA_MSK_SECRET_KEY ?? "secretKey";
export const KAFKA_MSK_USER_ID = process.env.KAFKA_MSK_USER_ID ?? "userId";
export const KAFKA_MSK_REGION = process.env.KAFKA_MSK_REGION ?? "local";

export const ENABLE_CONSUMED_CAPACITY_TRACKING = process.env.ENABLE_CONSUMED_CAPACITY_TRACKING === "true";
export const BLOCK_DB_VALIDATION_ENABLED = process.env.BLOCK_DB_VALIDATION_ENABLED === "true";
export const BLOCK_INTERVAL_MS = Number(process.env.BLOCK_INTERVAL_MS) || 2000;
export const BLOCK_DB_VALIDATION_INTERVAL = Number(process.env.BLOCK_DB_VALIDATION_INTERVAL) || 50;
export const BLOCK_BD_VALIDATION_OFFSET = Number(process.env.BLOCK_DB_VALIDATION_OFFSET) || 50;
export const SERVICE_NAME = process.env.SERVICE_NAME ?? `explorer-ui`;

export const MAXIMUM_BLOCK_HEIGHT_DIFFERENCE = 1000;
export const GSI_PARTITION_KEY_HEIGHT_BATCH_SIZE = 10000;

export const MAXIMUM_LIST_SIZE = 1000;
export const UPDATE_VALIDATOR_MAPPING = process.env.UPDATE_VALIDATOR_MAPPING === "true";
