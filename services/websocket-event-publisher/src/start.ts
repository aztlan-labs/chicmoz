import { blockHandler, pendingTxHandler } from "./event-handler/index.js";
import { logger } from "./logger.js";
import { init as initMb, startSubscribe } from "./message-bus/index.js";
import { init as initWsServer } from "./ws-server/index.js";
import { registerShutdownCallback } from "./stop.js";

export const start = async () => {
  const shutdownWsServer = await initWsServer();
  logger.info("✅ WS");
  registerShutdownCallback(shutdownWsServer);
  const shutdownMb = await initMb();
  logger.info("✅ MB");
  registerShutdownCallback(shutdownMb);
  await startSubscribe(blockHandler);
  await startSubscribe(pendingTxHandler);
};
