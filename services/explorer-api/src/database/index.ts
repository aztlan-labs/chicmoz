import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { dbCredentials } from "../environment.js";
import * as schema from "./schema/index.js";

let db: ReturnType<typeof drizzle>;
let isInitialized = false;
let isShutDown = false;

export const ID = "DB";

export const init = async () => {
  const client = new pg.Client(dbCredentials);

  db = drizzle(client, { schema });

  await client.connect();
  isInitialized = true;

  return {
    shutdownCb: async () => {
      isShutDown = true;
      await client.end();
    },
  };
};

export const getDb = () => {
  if (!isInitialized) throw new Error("Database not initialized");
  if (isShutDown) throw new Error("Database has been shut down");
  return db;
};

export * as controllers from "./controllers/index.js";
