import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  POSTGRES_ADMIN,
  POSTGRES_DB_NAME,
  POSTGRES_IP,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
} from "../environment.js";
import * as schema from "./schema/index.js";

let db: ReturnType<typeof drizzle>;

export const init = async () => {
  const client = new pg.Client({
    host: POSTGRES_IP,
    port: POSTGRES_PORT,
    user: POSTGRES_ADMIN,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB_NAME,
  });

  db = drizzle(client, { schema });

  await client.connect();

  return {
    shutdownDb: async () => {
      await client.end();
    },
  };
};

export const getDb = () => db;
export * as controllers from "./controllers/index.js";
