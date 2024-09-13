/* eslint-disable no-console, @typescript-eslint/no-unsafe-member-access */

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import { backOff } from "exponential-backoff";
import { dbCredentials } from "../src/constants.js";

const pool = new pg.Pool(dbCredentials);

const db = drizzle(pool);

const retries = 50;

async function runMigrations() {
  console.log("🥸 Running migrations...");

  const tryIt = async () =>
    await migrate(db, { migrationsFolder: "./migrations" });

  await backOff(tryIt, {
    maxDelay: 10000,
    numOfAttempts: retries,
    retry: (e, attemptNumber: number) => {
      if (e.code === "ECONNREFUSED") {
        console.log(
          `Could not connect to DB with ${dbCredentials.host}:${dbCredentials.port}`
        );
        console.log(`Retrying attempt ${attemptNumber} of ${retries}...`);
        return true;
      }
      console.error(e.stack);
      return false;
    },
  });

  console.log("🤩 Migrations complete!");

  await pool.end();
}

runMigrations().catch(console.error);
