import { ChicmozChainInfoEvent } from "@chicmoz-pkg/message-registry";
import { logger } from "../../logger.js";

// eslint-disable-next-line @typescript-eslint/require-await
export const onChainInfo = async (event: ChicmozChainInfoEvent) => {
  logger.info(`🔗 chain info event ${JSON.stringify(event)}`);
  // TODO: store
};
