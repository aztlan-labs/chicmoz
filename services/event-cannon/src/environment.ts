import { apiKeySchema } from "@chicmoz-pkg/types";

export const SERVICE_NAME = process.env.SERVICE_NAME ?? "event-cannon";

export const AZTEC_RPC_URL = process.env.AZTEC_RPC_URL ?? "http://aztec.sandbox.chicmoz.localhost";
export const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL ?? "http://eth.sandbox.chicmoz.localhost";
export const EXPLORER_API_URL = process.env.EXPLORER_API_URL ?? "http://api.sandbox.chicmoz.localhost/v1";
export const EXPLORER_API_KEY = apiKeySchema.parse(process.env.EXPLORER_API_KEY);
