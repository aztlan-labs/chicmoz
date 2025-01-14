import { MicroserviceBaseSvc } from "@chicmoz-pkg/microservice-base";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { dbCredentials } from "../../constants.js";
import * as schema from "./schema.js";

let db: ReturnType<typeof drizzle>;
let isInitialized = false;
let isShutDown = false;
let client: pg.Client;

const init = async () => {
  client = new pg.Client(dbCredentials);
  db = drizzle(client, { schema });
  await client.connect();
  isInitialized = true;
};

export const getDb = () => {
  if (!isInitialized) throw new Error("Database not initialized");
  if (isShutDown) throw new Error("Database has been shut down");
  return db;
};
export * as controllers from "./latestProcessedHeight.controller.js";

export const databaseService: MicroserviceBaseSvc = {
  serviceId: "DB",
  init,
  health: () => isInitialized && !isShutDown,
  shutdown: async () => {
    isShutDown = true;
    await client.end();
  },
};
