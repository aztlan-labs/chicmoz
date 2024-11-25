import { init as initCannon, start as startCannon } from "./cannon/index.js";
import { registerShutdownCallback } from "./stop.js";
import { logger } from "./logger.js";

export const start = async () => {
  const shutdownCannon = await initCannon();
  logger.info("✅ Cannon");
  registerShutdownCallback(shutdownCannon);
  await startCannon();
};
