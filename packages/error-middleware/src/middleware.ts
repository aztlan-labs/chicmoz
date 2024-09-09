import { Logger } from "@chicmoz-pkg/logger-server";
import { ErrorRequestHandler } from "express";
import "express-async-errors";
import {
  InsufficientScopeError,
  UnauthorizedError,
} from "express-oauth2-jwt-bearer";
import { ZodError } from "zod";
import { CHICMOZ_ERRORS } from "./errors.js";

export const createErrorMiddleware = (logger: Logger): ErrorRequestHandler => {
  return (err, _req, res, _next) => {
    if ((err as Error).stack) logger.error((err as Error).stack);
    else logger.error(err);

    if (
      err instanceof UnauthorizedError ||
      err instanceof InsufficientScopeError
    ) {
      res.status(err.status).header(err.headers).send(err.message);
      return;
    }

    if (err instanceof ZodError) {
      res
        .status(400)
        .send({ message: "Schema validation error", errors: err.issues });
      return;
    }

    for (const ChicmozError of CHICMOZ_ERRORS) {
      if (err instanceof ChicmozError) {
        res.status(err.code).send({ message: err.message });
        return;
      }
    }

    res.status(500).send({ message: "An internal error occurred" });
  };
};
