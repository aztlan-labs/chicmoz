import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
//import morgan from "morgan";
import { init as initApiRoutes } from "./routes/index.js";
import { createErrorMiddleware } from "@chicmoz-pkg/error-middleware";
import { genereateOpenApiSpec } from "./open-api-spec.js";
import { logger } from "../logger.js";
import { getHandler as geHealthHandler } from "../health.js";

type ExpressOptions = {
  BODY_LIMIT: string;
  PARAMETER_LIMIT: number;
  NODE_ENV: string;
};

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
  //app.use(morgan("common"));

  const router = express.Router();
  router.get("/health", geHealthHandler);
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
