import {
  ChicmozL2RpcNodeAliveEvent,
  ChicmozL2RpcNodeErrorEvent,
} from "@chicmoz-pkg/message-registry";
import { logger } from "../../logger.js";
import {
  storeL2RpcNode,
  storeL2RpcNodeError,
} from "../../svcs/database/controllers/l2/index.js";

export const onL2RpcNodeAlive = async (event: ChicmozL2RpcNodeAliveEvent) => {
  logger.info(`✔ L2RpcNodeAlive ${JSON.stringify(event)}`);
  await storeL2RpcNode(event.rpcUrl);
};

export const onL2RpcNodeError = async (event: ChicmozL2RpcNodeErrorEvent) => {
  logger.info(`❌ L2RpcNodeError ${JSON.stringify(event)}`);
  await storeL2RpcNodeError(event.nodeError);
};
