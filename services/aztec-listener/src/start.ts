import { init as initDb } from "./database/index.js";
import { init as initMb } from "./message-bus/index.js";
import { init as initAztec } from "./aztec/index.js";
import { registerShutdownCallback } from "./stop.js";
import { logger } from "./logger.js";
import { AZTEC_DISABLED } from "./constants.js";

export const start = async () => {
  const { shutdownDb } = await initDb();
  registerShutdownCallback(shutdownDb);
  const { shutdownMb } = await initMb();
  registerShutdownCallback(shutdownMb);
  if (AZTEC_DISABLED) {
    logger.info(
      "AZTEC_DISABLED is set to true, skipping initialization entirely..."
    );
  } else {
    const { shutdownAztec } = await initAztec();
    registerShutdownCallback(shutdownAztec);
  }
};
