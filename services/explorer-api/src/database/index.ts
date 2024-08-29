import { logger } from "../logger.js";

// eslint-disable-next-line @typescript-eslint/require-await
export const init = async () => {
  logger.info("DB: TODO");
  return {
    // eslint-disable-next-line @typescript-eslint/require-await
    shutdownDb: async () => {
      logger.info("DB: TODO");
    },
  };
};
