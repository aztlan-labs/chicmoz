import { MicroserviceBaseSvc } from "@chicmoz-pkg/microservice-base";
import { DrizzleConfig } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { dbCredentials, getConfigStr } from "./environment.js";

let client: pg.Client;
let db: ReturnType<typeof drizzle>;

let isInitialized = false;
let isShutDown = false;

const init = async (drizzleConfig: DrizzleConfig<Record<string, unknown>>) => {
  client = new pg.Client(dbCredentials);
  db = drizzle(client, drizzleConfig);
  await client.connect();
  isInitialized = true;
};

export const getDb = () => {
  if (!isInitialized) throw new Error("Database not initialized");
  if (isShutDown) throw new Error("Database has been shut down");
  return db;
};

export const generateSvc: (
  drizzleConf: DrizzleConfig<Record<string, unknown>>
) => MicroserviceBaseSvc = (drizzleConf) => ({
  serviceId: "DB",
  init: () => init(drizzleConf),
  getConfigStr,
  health: () => isInitialized && !isShutDown,
  shutdown: async () => {
    isShutDown = true;
    await client.end();
  },
});
