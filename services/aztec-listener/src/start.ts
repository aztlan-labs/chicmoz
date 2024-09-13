import { init as initDb } from "./database/index.js";
import { init as initMb } from "./message-bus/index.js";
import { init as initAztec } from "./aztec/index.js";
import { registerShutdownCallback } from "./stop.js";

export const start = async () => {
  const { shutdownDb } = await initDb();
  registerShutdownCallback(shutdownDb);
  const { shutdownMb } = await initMb();
  registerShutdownCallback(shutdownMb);
  const { shutdownAztec } = await initAztec();
  registerShutdownCallback(shutdownAztec);
};
