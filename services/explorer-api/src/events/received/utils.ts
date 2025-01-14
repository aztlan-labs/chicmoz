import { logger } from "../../logger.js";
import { onNewChainDetected } from "./on-new-chain-detected.js";

export type PartialDbError = {
  code: string;
  detail: string;
};

export const handleDuplicateBlockError = async (
  e: Error | PartialDbError,
  additionalInfo: string
): Promise<boolean> => {
  if ((e as PartialDbError).code === "23505") {
    if ((e as PartialDbError).detail.includes("hash")) {
      logger.warn(`DB Duplicate Block: ${additionalInfo}`);
    } else if ((e as PartialDbError).detail.includes("height")) {
      await onNewChainDetected();
      return true;
    }
  } else {
    handleOtherError(e as Error, additionalInfo);
  }
  return false;
};

export const handleDuplicateError = (
  e: Error | PartialDbError,
  additionalInfo: string
) => {
  if ((e as PartialDbError).code === "23505") {
    logger.warn(`DB Duplicate: ${additionalInfo}`);
    return;
  }
  handleOtherError(e as Error, additionalInfo);
};

const handleOtherError = (e: Error, additionalInfo: string) => {
  if (e.stack) {
    logger.error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Failed to store ${additionalInfo}: ${e?.stack}`
    );
    return;
  }
  logger.warn(JSON.stringify(e));
  logger.error(new Error(`Failed to store ${additionalInfo}`).stack);
};
