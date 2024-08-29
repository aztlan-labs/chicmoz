import { createErrorMiddleware } from "@chicmoz-pkg/error-middleware";
import bodyParser from "body-parser";
import express from "express";
import http from "http";
import { BODY_LIMIT, NODE_ENV, PARAMETER_LIMIT, PORT } from "../environment.js";
import { logger } from "../logger.js";
import { expressConfig } from "./express-config.js";
import { newRouter } from "./routes/route.js";

export const init = async () => {
  let resolveInit: () => void;
  const initPromise = new Promise<void>((resolve) => {
    resolveInit = resolve;
  });
  logger.info(`Initializing express server...`);

  const app = express();
  expressConfig(app, {
    BODY_LIMIT,
    PARAMETER_LIMIT,
    NODE_ENV,
  });

  app.use(newRouter({ logger }));

  // body parser should be configured AFTER proxy configuration https://www.npmjs.com/package/express-http-proxy#middleware-mixing
  app.use(
    bodyParser.json({
      limit: BODY_LIMIT,
    })
  );
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: BODY_LIMIT,
      parameterLimit: PARAMETER_LIMIT,
    })
  );

  const errorMiddleware = createErrorMiddleware(logger);
  app.use(errorMiddleware);

  const server = http.createServer(app);

  process.on("unhandledRejection", (err) => {
    logger.error("unhandledRejection:", err);
    throw err;
  });

  process.on("uncaughtException", (err) => {
    logger.error(`uncaughtException ${err.stack}`);
    throw err;
  });

  server.listen(PORT, "0.0.0.0", () => {
    logger.info(`Service listening on port ${PORT} [${NODE_ENV} mode]`);
    resolveInit();
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
    shutdownHttpServer: gracefulShutdown,
  };
};
