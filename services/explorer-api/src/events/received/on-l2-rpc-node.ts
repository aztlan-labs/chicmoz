import {
  ChicmozL2RpcNodeAliveEvent,
  ChicmozL2RpcNodeErrorEvent,
} from "@chicmoz-pkg/message-registry";
import { logger } from "../../logger.js";

// eslint-disable-next-line @typescript-eslint/require-await
export const onL2RpcNodeAlive = async (event: ChicmozL2RpcNodeAliveEvent) => {
  logger.info(`✔ L2RpcNodeAlive ${JSON.stringify(event)}`);
  // TODO: store
};

// eslint-disable-next-line @typescript-eslint/require-await
export const onL2RpcNodeError = async (event: ChicmozL2RpcNodeErrorEvent) => {
  logger.info(`❌ L2RpcNodeError ${JSON.stringify(event)}`);
  // TODO: store
};
