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
    if (err instanceof Error) {
      logger.error(`Error-handler: name: ${err.name}, message: ${err.message}`);
      if (err.stack) logger.error(`Error-handler: stack: ${err.stack}`);
      else logger.error(err);
    }

    if ((err as Error).message === "PayloadTooLargeError") {
      res.status(413).send({ message: "Payload too large" });
      return;
    }

    if (
      err instanceof UnauthorizedError ||
      err instanceof InsufficientScopeError
    ) {
      res.status(err.status).header(err.headers).send(err.message);
      return;
    }

    if (err instanceof ZodError) {
      logger.info(JSON.stringify(err.issues));
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
