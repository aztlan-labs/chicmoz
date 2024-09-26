import { init as initDb } from "./database/index.js";
import { blockHandler, catchupHandler } from "./event-handler/index.js";
import { init as initHttpServer } from "./http-server/index.js";
import { logger } from "./logger.js";
import { init as initMb, startSubscribe } from "./message-bus/index.js";
import { registerShutdownCallback } from "./stop.js";

export const start = async () => {
  const shutdownDb = await initDb();
  logger.info("✅ DB");
  registerShutdownCallback(shutdownDb);
  const shutdownHttpServer = await initHttpServer();
  logger.info("✅ SERVER");
  registerShutdownCallback(shutdownHttpServer);
  const shutdownMb = await initMb();
  logger.info("✅ MB");
  registerShutdownCallback(shutdownMb);
  await startSubscribe(blockHandler);
  await startSubscribe(catchupHandler);
};
