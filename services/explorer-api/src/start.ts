import * as cache from "./cache/index.js";
import {deleteAllTxs} from "./database/controllers/l2Tx/delete-all-txs.js";
import * as db from "./database/index.js";
import { subscribeHandlers } from "./event-handler/index.js";
import { setComponentInitializing, setComponentUp } from "./health.js";
import * as httpServer from "./http-server/index.js";
import * as mb from "./message-bus/index.js";
import { registerShutdownCallback } from "./stop.js";

const initialize = async ({
  ID,
  init,
}: {
  ID: string;
  init: () => Promise<{ shutdownCb: () => Promise<void> }>;
}) => {
  setComponentInitializing(ID);
  const { shutdownCb } = await init();
  registerShutdownCallback({
    id: ID,
    shutdownCb,
  });
  setComponentUp(ID);
};

export const start = async () => {
  await initialize({
    ID: cache.ID,
    init: cache.init,
  });
  await initialize({
    ID: db.ID,
    init: db.init,
  });
  await initialize({
    ID: httpServer.ID,
    init: httpServer.init,
  });
  await initialize({
    ID: mb.ID,
    init: mb.init,
  });
  await deleteAllTxs(); // TODO: perhaps a more specific deleteAllTxs should be created, also some logs could be good.
  setComponentInitializing("SUBSCRIPTIONS");
  await subscribeHandlers();
  setComponentUp("SUBSCRIPTIONS");
};
