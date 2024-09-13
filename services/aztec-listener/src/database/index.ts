import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { dbCredentials } from "../constants.js";
import * as schema from "./schema.js";

let db: ReturnType<typeof drizzle>;

export const init = async () => {
  const client = new pg.Client(dbCredentials);

  db = drizzle(client, { schema });

  await client.connect();

  return {
    shutdownDb: async () => {
      await client.end();
    },
  };
};

export const getDb = () => db;
export * as controllers from "./latestProcessedHeight.controller.js";
