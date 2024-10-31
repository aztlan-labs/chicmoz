import { logger } from "../../logger.js";

export type PartialDbError = {
  code: string;
};

export const handleDuplicateError = (
  e: Error | PartialDbError,
  additionalInfo: string
) => {
  if ((e as PartialDbError).code === "23505") {
    logger.warn(`DB Duplicate: ${additionalInfo}`);
    return;
  }
  if ((e as Error).stack) {
    logger.error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Failed to store ${additionalInfo}: ${(e as Error)?.stack}`
    );
    return;
  }
  logger.warn(JSON.stringify(e));
  logger.error(new Error(`Failed to store ${additionalInfo}`).stack);
};
