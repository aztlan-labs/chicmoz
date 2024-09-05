import { defineConfig } from "drizzle-kit";
import { dbCredentials } from "./src/environment.js";

// NOTE: this file is, and should be, used by migrations only

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  schema: "./src/database/schema",
  out: "./migrations",
  dbCredentials,
  dialect: "postgresql",
  verbose: true,
  strict: false,
});
