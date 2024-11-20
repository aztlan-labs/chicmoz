import * as cache from "./cache/index.js";
import * as db from "./database/index.js";
import {
  blockHandler,
  catchupHandler,
  connectedToAztecHandler,
  pendingTxHandler,
} from "./event-handler/index.js";
import {onNewChainDetected} from "./event-handler/on-new-chain-detected.js";
import { setComponentInitializing, setComponentUp } from "./health.js";
import * as httpServer from "./http-server/index.js";
import * as mb from "./message-bus/index.js";
import { registerShutdownCallback } from "./stop.js";

const initialize = async ({ ID, init }: { ID: string; init: () => Promise<{ shutdownCb: () => Promise<void> }> }) => {
  setComponentInitializing(ID);
  const { shutdownCb } = await init();
  registerShutdownCallback({
    id: ID,
    shutdownCb,
  });
  setComponentUp(ID);
}

export const start = async () => {
  await initialize({
    ID: cache.ID,
    init: cache.init,
  });
  await initialize({
    ID: db.ID,
    init: db.init,
  });
  if (process.env.NODE_ENV === "development") 
    await onNewChainDetected();
  
  await initialize({
    ID: httpServer.ID,
    init: httpServer.init,
  });
  await initialize({
    ID: mb.ID,
    init: mb.init,
  });
  // TODO: clear pending txs DB
  setComponentInitializing("SUBSCRIPTIONS");
  await mb.startSubscribe(blockHandler);
  await mb.startSubscribe(catchupHandler);
  await mb.startSubscribe(pendingTxHandler);
  await mb.startSubscribe(connectedToAztecHandler);
  setComponentUp("SUBSCRIPTIONS");
};
