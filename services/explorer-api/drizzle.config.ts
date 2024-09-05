import { defineConfig } from "drizzle-kit";
import {
  POSTGRES_IP,
  POSTGRES_PORT,
  POSTGRES_ADMIN,
  POSTGRES_PASSWORD,
  POSTGRES_DB_NAME,
} from "./src/environment.js";

// NOTE: this file is, and should be, used by migrations only

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  schema: "./src/database/schema",
  out: "./migrations",
  dbCredentials: {
    host: POSTGRES_IP,
    port: POSTGRES_PORT,
    user: POSTGRES_ADMIN,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB_NAME,
  },
  dialect: "postgresql",
  verbose: true,
  strict: false,
});
