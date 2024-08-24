import { createErrorMiddleware } from "@chicmoz-pkg/error-middleware";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";
import { Sequelize } from "sequelize";
import {
  BODY_LIMIT,
  NODE_ENV,
  PARAMETER_LIMIT,
  PORT,
  POSTGRES_ADMIN,
  POSTGRES_DB_NAME,
  POSTGRES_IP,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  REDIS_HOST,
  REDIS_PORT,
} from "./constants.js";
import { Core } from "./core.js";
import { DB } from "./database/db.js";
import { RateLimitDb } from "./database/rate-limit.js";
import { newRouter } from "./routes/index.js";
import { logger } from "./utils/logger.js";

const config = () => {
  const app = express();

  app.disable("etag");

  if (NODE_ENV === "production") app.use(helmet());
  app.use(cors({ credentials: true }));

  app.use(
    bodyParser.json({
      limit: BODY_LIMIT,
    }),
  );
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: BODY_LIMIT,
      parameterLimit: PARAMETER_LIMIT,
    }),
  );
  app.use(morgan("common"));

  return app;
};

const shutdown = (deps: { sequelize: Sequelize; server: http.Server; rateLimitDb: RateLimitDb }) => async () => {
  const { server, sequelize, rateLimitDb } = deps;

  logger.info(`Stopping server`);

  await sequelize.close();
  await rateLimitDb.disconnect();

  server.close((error) => {
    if (error) throw error;
    logger.info("Stopped server");
    process.exit(0);
  });
};

const startup = async () => {
  const sequelize = new Sequelize(POSTGRES_DB_NAME, POSTGRES_ADMIN, POSTGRES_PASSWORD, {
    dialect: "postgres",
    host: POSTGRES_IP,
    port: POSTGRES_PORT,
  });

  await sequelize.authenticate();
  const db = new DB({ sequelize, logger });
  const app = config();

  const rateLimitDb = new RateLimitDb({ host: REDIS_HOST, port: REDIS_PORT });
  await rateLimitDb.connect();

  const core = new Core({ db, logger, rateLimitDb });
  await core.init();
  await db.sync();

  app.use(newRouter({ db, core, logger }));

  const errorMiddleware = createErrorMiddleware(logger);
  app.use(errorMiddleware);

  const server = http.createServer(app);

  process.on("unhandledRejection", (err) => {
    logger.error("unhandledRejection", err);
    throw err;
  });

  process.on("uncaughtException", (err) => {
    logger.error("uncaughtException", err);
    throw err;
  });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  process.on("SIGTERM", shutdown({ server, sequelize, rateLimitDb }));
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  process.on("SIGINT", shutdown({ server, sequelize, rateLimitDb }));

  server.listen(PORT, "0.0.0.0", () => {
    logger.info(`Service listening on port ${PORT} [${NODE_ENV} mode]`);
  });
};

await startup();
