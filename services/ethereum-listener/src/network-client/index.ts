import { NewL1Event } from "@chicmoz-pkg/message-registry";
import { logger } from "../logger.js";
import { emit } from "../events/index.js";

export const init = async () => {
  const mockedL1Event: NewL1Event = {
    contractAddress: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
    l1BlockNumber: 123,
    data: { something: "something" },
  };
  logger.info(`ETH: initialized: ${JSON.stringify(mockedL1Event)}`);

  await emit.l1Update(mockedL1Event);
  // TODO: start polling

  return {
    id: "NC",
    // eslint-disable-next-line @typescript-eslint/require-await
    shutdownCb: async () => {
      // TODO: stop polling
    },
  };
};
