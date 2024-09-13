import { defineConfig } from "drizzle-kit";
import { dbCredentials } from "./build/src/constants.js";

// NOTE: this file is only used by the `drizzle-kit` CLI

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  schema: "./build/src/database/schema.js",
  out: "./migrations",
  dbCredentials,
  dialect: "postgresql",
  verbose: true,
  strict: false,
});
