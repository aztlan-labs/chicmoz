import { ChicmozSequencerEvent } from "@chicmoz-pkg/message-registry";
import { logger } from "../../logger.js";
import { storeL2Sequencer } from "../../svcs/database/controllers/l2/index.js";

export const onSequencerInfoEvent = async (event: ChicmozSequencerEvent) => {
  logger.info(`🔍 SequencerInfo ${JSON.stringify(event)}`);
  await storeL2Sequencer(event.sequencer);
};
