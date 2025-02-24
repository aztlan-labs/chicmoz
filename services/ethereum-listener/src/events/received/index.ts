import { EventHandler } from "@chicmoz-pkg/message-bus";
import {
  ChicmozChainInfoEvent,
  generateL2TopicName,
} from "@chicmoz-pkg/message-registry";
import { SERVICE_NAME } from "../../constants.js";
import { L2_NETWORK_ID } from "../../environment.js";
import { logger } from "../../logger.js";
import { storeL1ContractAddresses } from "../../svcs/database/controllers.js";
import { ensureStarted } from "../../svcs/events-watcher/index.js";
const groupId = `${SERVICE_NAME}-${L2_NETWORK_ID}`;

export const onChainInfo = async (event: ChicmozChainInfoEvent) => {
  logger.info(`🔗 chain info event ${JSON.stringify(event)}`);
  await storeL1ContractAddresses(event.chainInfo.l1ContractAddresses);
  await ensureStarted();
};

export const connectedToAztec: EventHandler = {
  groupId: `${groupId}-connected-to-aztec`,
  cb: onChainInfo as (arg0: unknown) => Promise<void>,
  topic: generateL2TopicName(L2_NETWORK_ID, "CHAIN_INFO_EVENT"),
};
