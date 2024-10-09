/* eslint-disable no-console, @typescript-eslint/no-unsafe-member-access */

import { Logger } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { backOff } from "exponential-backoff";
import pg, { PoolClient } from "pg";
import { dbCredentials } from "../src/constants.js";

class MyLogger implements Logger {
  logQuery(query: string): void {
    console.log("QUERY:", query);
  }
}

const pool = new pg.Pool(dbCredentials);
const db = drizzle(pool, { logger: new MyLogger() });
const retries = 50;

async function printTableList(client: PoolClient, ID: string): Promise<void> {
  const res = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
  );
  console.log(`=========== ${ID} ============`);
  res.rows.forEach((row) => console.log(row.table_name));
  console.log("==============================");
}

async function tryMigrate() {
  const client = await pool.connect();
  await printTableList(client, "BEFORE MIGRATION");
  await migrate(db, { migrationsFolder: "./migrations" });
  await printTableList(client, "AFTER MIGRATION");
  client.release();
  console.log("👌 Client released");
}

async function runMigrations() {
  console.log("🥸 Running migrations...");
  console.log(
    `host: ${dbCredentials.host} port: ${dbCredentials.port} db: ${dbCredentials.database} user: ${dbCredentials.user}`
  );
  await backOff(() => tryMigrate(), {
    maxDelay: 10000,
    numOfAttempts: retries,
    retry: (e, attemptNumber: number) => {
      if (e.code === "ECONNREFUSED") {
        console.log(`Retrying attempt ${attemptNumber} of ${retries}...`);
        return true;
      }
      console.error(e);
      return false;
    },
  });
  console.log("🤩 Migrations complete!");
  await pool.end();
  console.log("👋 Pool closed!");
}

runMigrations().catch(async (e) => {
  console.error(e);
  await pool.end();
  console.log("👋 Pool closed!");
  process.exit(1);
});

