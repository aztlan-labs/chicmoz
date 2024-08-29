import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

type ExpressOptions = {
  BODY_LIMIT: string;
  PARAMETER_LIMIT: number;
  NODE_ENV: string;
};

export function expressConfig(app: express.Application, options: ExpressOptions): express.Application {
  if (options.NODE_ENV === "production") app.use(helmet());
  app.use(cors({ credentials: true }));

  app.use(
    bodyParser.json({
      limit: options.BODY_LIMIT,
    }),
  );
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: options.BODY_LIMIT,
      parameterLimit: options.PARAMETER_LIMIT,
    }),
  );
  app.use(morgan("common"));

  return app;
}
