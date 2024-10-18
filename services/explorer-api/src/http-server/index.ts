import express from "express";
import http from "http";
import { BODY_LIMIT, NODE_ENV, PARAMETER_LIMIT, PORT } from "../environment.js";
import { logger } from "../logger.js";
import { setup } from "./express-config.js";

export const ID = "SERVER";

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

  const server = http.createServer(app);

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

  const gracefulShutdown = async () => {
    logger.info(`Shutting down http server...`);
    await new Promise<void>((resolve) => {
      server.close(() => {
        logger.info(`Http server closed`);
        resolve();
      });
    });
  };

  await initPromise;

  return {
    shutdownCb: gracefulShutdown,
  };
};
