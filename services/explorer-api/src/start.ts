import { init as initDb } from "./database/index.js";
import { blockHandler } from "./event-handler/index.js";
import { init as initHttpServer } from "./http-server/index.js";
import { init as initMb, startSubscribe } from "./message-bus/index.js";
import {registerShutdownCallback} from "./stop.js";

export const start = async () => {
  const { shutdownDb } = await initDb();
  registerShutdownCallback(shutdownDb);
  const { shutdownHttpServer } = await initHttpServer();
  registerShutdownCallback(shutdownHttpServer);
  const { shutdownMb } = await initMb();
  registerShutdownCallback(shutdownMb);
  await startSubscribe(blockHandler, () => {
    process.kill(process.pid, "SIGTERM");
  });
};
