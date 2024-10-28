import {
  ConnectedToAztecEvent,
  NewL1Event,
} from "@chicmoz-pkg/message-registry";
import { logger } from "../logger.js";
import { emit } from "../events/index.js";

// eslint-disable-next-line @typescript-eslint/require-await
export const init = async () => {
  // TODO: init connection to ethereum RPC

  return {
    id: "NC",
    // eslint-disable-next-line @typescript-eslint/require-await
    shutdownCb: async () => {
      // TODO: stop polling
    },
  };
};

export const startPolling = async (
  l1ContractAddresses: ConnectedToAztecEvent["nodeInfo"]["l1ContractAddresses"]
) => {
  logger.info(`ETH: start polling: ${JSON.stringify(l1ContractAddresses)}`);
  const mockedL1Event: NewL1Event = {
    contractAddress: l1ContractAddresses.rollupAddress,
    l1BlockNumber: 123,
    data: { something: "something" },
  };
  await emit.l1Update(mockedL1Event);
};
