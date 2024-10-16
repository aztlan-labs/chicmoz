import { ConnectedToAztecEvent } from "@chicmoz-pkg/message-registry";
import { logger } from "../logger.js";
import { aztecChainConnection } from "../database/controllers/index.js";

export const onAztecConnectionEvent = async (event: ConnectedToAztecEvent) => {
  logger.info(`🔗 Aztec connection event ${JSON.stringify(event)}`);
  await aztecChainConnection.store(event);
};
