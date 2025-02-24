import { generateSvc } from "@chicmoz-pkg/postgres-helper";
import { ensureInitializedBlockHeights } from "./controllers.js";
import * as schema from "./schema.js";

export * as controllers from "./controllers.js";

const postInit = async () => {
  await ensureInitializedBlockHeights();
};

export const databaseService = {
  ...generateSvc({ schema }),
  postInit,
};
