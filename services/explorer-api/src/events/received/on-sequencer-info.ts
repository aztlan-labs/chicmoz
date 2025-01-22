import { ChicmozSequencerInfoEvent } from "@chicmoz-pkg/message-registry";
import { logger } from "../../logger.js";

export const onSequencerInfoEvent = async (
  event: ChicmozSequencerInfoEvent
// eslint-disable-next-line @typescript-eslint/require-await
) => {
  logger.info(`🔍 SequencerInfo ${JSON.stringify(event)}`);
  // TODO: store
};
