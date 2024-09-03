import { defineConfig } from "drizzle-kit";

// NOTE: this file is, and should be, used by migrations only

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  schema: "./src/database/schema",
  out: "./migrations",
  dbCredentials: {
    host:  process.env.POSTGRES_IP!,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_ADMIN,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB_NAME!,
  },
  dialect: "postgresql",
  verbose: true,
  strict: false,
});
