import { subscribeHandlers } from "./events/received/index.js";
import { deleteAllTxs } from "./svcs/database/controllers/l2Tx/delete-all-txs.js";

export const start = async () => {
  await deleteAllTxs(); // TODO: perhaps a more specific deleteAllTxs should be created, also some logs could be good.
  await subscribeHandlers();
};
