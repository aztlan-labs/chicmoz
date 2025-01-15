import { ConnectedToL2Event } from "@chicmoz-pkg/message-registry";
import { logger } from "../../logger.js";
import { aztecChainConnection } from "../../svcs/database/controllers/index.js";

export const onAztecConnectionEvent = async (event: ConnectedToL2Event) => {
  logger.info(`🔗 Aztec connection event ${JSON.stringify(event)}`);
  await aztecChainConnection.store(event);
};
