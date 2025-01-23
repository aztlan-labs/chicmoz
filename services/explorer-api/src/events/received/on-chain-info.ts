import { ChicmozChainInfoEvent } from "@chicmoz-pkg/message-registry";
import { logger } from "../../logger.js";
import {storeChainInfo} from "../../svcs/database/controllers/l2/index.js";

export const onChainInfo = async (event: ChicmozChainInfoEvent) => {
  logger.info(`🔗 chain info event ${JSON.stringify(event)}`);
  await storeChainInfo(event.chainInfo);
};
