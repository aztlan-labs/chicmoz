/* eslint-disable no-console */
import { dbCredentials } from "../src/constants.js";
import { runMigrations } from "@chicmoz-pkg/backend-utils";

runMigrations(dbCredentials).catch(console.error);

