import { EventHandler } from "@chicmoz-pkg/message-bus";
import {
  ChicmozChainInfoEvent,
  generateL2TopicName,
  getConsumerGroupId,
} from "@chicmoz-pkg/message-registry";
import { SERVICE_NAME } from "../../constants.js";
import { L2_NETWORK_ID } from "../../environment.js";
import { logger } from "../../logger.js";
import { storeChainInfo } from "../../svcs/database/controllers/l2/index.js";

const onChainInfo = async (event: ChicmozChainInfoEvent) => {
  logger.info(`🔗 chain info event ${JSON.stringify(event)}`);
  await storeChainInfo(event.chainInfo);
};

export const chainInfoHandler: EventHandler = {
  groupId: getConsumerGroupId({
    serviceName: SERVICE_NAME,
    networkId: L2_NETWORK_ID,
    handlerName: "chainInfoHandler",
  }),
  topic: generateL2TopicName(L2_NETWORK_ID, "CHAIN_INFO_EVENT"),
  cb: onChainInfo as (arg0: unknown) => Promise<void>,
};
