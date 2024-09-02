import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { init as initRoutes } from "./routes/index.js";
import { createErrorMiddleware } from "@chicmoz-pkg/error-middleware";
import { logger } from "../logger.js";

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
  app.use(morgan("common"));

  const router = express.Router();
  initRoutes({ router });
  app.use(router);

  const errorMiddleware = createErrorMiddleware(logger);
  app.use(errorMiddleware);
  return app;
}
