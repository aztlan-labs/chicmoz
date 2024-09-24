import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { dbCredentials } from "../environment.js";
import * as schema from "./schema/index.js";

let db: ReturnType<typeof drizzle>;
let initialized = false;
let shutDown = false;

export const init = async () => {
  const client = new pg.Client(dbCredentials);

  db = drizzle(client, { schema });

  await client.connect();

  initialized = true;

  return {
    shutdownDb: async () => {
      shutDown = true;
      await client.end();
    },
  };
};

export const getDb = () => {
  if (!initialized) throw new Error("Database not initialized");

  if (shutDown) throw new Error("Database has been shut down");

  return db;
};

export * as controllers from "./controllers/index.js";
