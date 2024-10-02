import bodyParser from "body-parser";
import asyncHandler from "express-async-handler";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { init as initApiRoutes } from "./routes/index.js";
import { createErrorMiddleware } from "@chicmoz-pkg/error-middleware";
import { genereateOpenApiSpec } from "./open-api-spec.js";
import { logger } from "../logger.js";

type ExpressOptions = {
  BODY_LIMIT: string;
  PARAMETER_LIMIT: number;
  NODE_ENV: string;
};

const getHealthHandler = asyncHandler((_req, res) => {
  // perhaps should be injected?
  // TODO: evaluate actual health checks
  //   - db
  //   - message bus
  res.sendStatus(200);
});

export function setup(
  app: express.Application,
  options: ExpressOptions
): express.Application {
  if (options.NODE_ENV === "production") app.use(helmet());
  app.use(cors({ credentials: true }));

  // NOTE: body parser should be configured AFTER proxy configuration https://www.npmjs.com/package/express-http-proxy#middleware-mixing
  app.use(
    bodyParser.json({
      limit: options.BODY_LIMIT,
    })
  );
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: options.BODY_LIMIT,
      parameterLimit: options.PARAMETER_LIMIT,
    })
  );
  app.use(morgan("common"));

  const router = express.Router();
  router.get("/health", getHealthHandler);
  const openApiSpec = genereateOpenApiSpec();
  router.get("/open-api-specification", (_req, res) => {
    res.json(openApiSpec);
  });
  initApiRoutes({ router });
  app.use(router);

  const errorMiddleware = createErrorMiddleware(logger);
  app.use(errorMiddleware);
  return app;
}
