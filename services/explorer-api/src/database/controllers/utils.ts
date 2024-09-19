import { ZodError } from "zod";
import { logger } from "../../logger.js";

export const dbParseErrorCallback = (e: Error) => {
  if (e instanceof ZodError) {
    logger.error(`FATAL - dbParseErrorCallback: ${JSON.stringify(e.issues)}`);
    // NOTE: throwing normal error so we give 500 status code
    throw new Error("Internal server error (DB)");
  } else {
    // NOTE: this should never happen
    logger.error(
      `BIG PROBLEM - dbParseErrorCallback: returned an error that is not ZodError: ${e.message}`
    );
    throw e;
  }
};
