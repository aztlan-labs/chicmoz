import { init as initMb } from "./message-bus/index.js";
import { init as initNetworkClient } from "./network-client/index.js";
import { registerShutdownCallback } from "./stop.js";
import { logger } from "./logger.js";

export const start = async () => {
  const shutdownMb = await initMb();
  logger.info("✅ MB");
  registerShutdownCallback(shutdownMb);
  const shutdownNetworkClient = await initNetworkClient();
  logger.info("✅ NC");
  registerShutdownCallback(shutdownNetworkClient);
  // await startSubscribe(aztecConnectedEventHandler);
};
