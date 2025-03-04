import { MicroserviceBaseSvc } from "@chicmoz-pkg/microservice-base";
import { NODE_ENV } from "@chicmoz-pkg/types";
import express from "express";
import http from "http";
import {
  ARTIFACT_BODY_LIMIT,
  BODY_LIMIT,
  PARAMETER_LIMIT,
  PORT,
} from "../../environment.js";
import { logger } from "../../logger.js";
import { setup } from "./express-config.js";

let server: http.Server;

export const init = async () => {
  let resolveInit: () => void;
  const initPromise = new Promise<void>((resolve) => {
    resolveInit = resolve;
  });
  logger.info(`Initializing express server...`);
  const app = express();

  setup(app, {
    BODY_LIMIT,
    PARAMETER_LIMIT,
    NODE_ENV,
  });

  server = http.createServer(app);

  server.listen(PORT, "0.0.0.0", () => {
    logger.info(`Service listening on port ${PORT} [${NODE_ENV} mode]`);
    resolveInit();
  });

  process.on("unhandledRejection", (err) => {
    logger.error("unhandledRejection:", err);
    throw err;
  });

  process.on("uncaughtException", (err) => {
    logger.error(`uncaughtException ${err.stack}`);
    throw err;
  });

  await initPromise;
};

export const httpServerService: MicroserviceBaseSvc = {
  svcId: "HTTP_SERVER",
  init,
  getConfigStr: () => `EXPRESS
PORT: ${PORT}
BODY_LIMIT: ${BODY_LIMIT}
PARAMETER_LIMIT: ${PARAMETER_LIMIT}
ARTIFACT_BODY_LIMIT: ${ARTIFACT_BODY_LIMIT}`,
  health: () => true,
  shutdown: async () => {
    await new Promise<void>((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  },
};
