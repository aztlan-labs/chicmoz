import { init as initDb } from "./database/index.js";
import { blockHandler } from "./event-handler/index.js";
import { init as initHttpServer } from "./http-server/index.js";
import { init as initMb, startSubscribe } from "./message-bus/index.js";

export const start = async () => {
  const { shutdownDb } = await initDb();
  const { shutdownHttpServer } = await initHttpServer();
  const { shutdownMb } = await initMb();
  await startSubscribe(blockHandler);
  return {
    shutdownDb,
    shutdownMb,
    shutdownHttpServer,
  };
};
