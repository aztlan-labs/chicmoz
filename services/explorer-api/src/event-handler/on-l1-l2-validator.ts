import { L1L2ValidatorEvent } from "@chicmoz-pkg/message-registry";
import { logger } from "../logger.js";
import { l1 } from "../database/controllers/index.js";

export const onL1L2Validator = async (event: L1L2ValidatorEvent) => {
  logger.info(`🤖 L1L2 validator event ${JSON.stringify(event)}`);
  await l1.storeL1L2Validator(event.validator);
};
