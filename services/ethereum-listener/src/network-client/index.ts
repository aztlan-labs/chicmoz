import { ConnectedToL2Event } from "@chicmoz-pkg/message-registry";
import { IBackOffOptions, backOff } from "exponential-backoff";
import { logger } from "../logger.js";
import {
  getLatestHeight,
  initClient,
  initContracts,
  queryStakingStateAndEmitUpdates,
  watchContractsEvents,
} from "./client.js";

const backOffOptions: Partial<IBackOffOptions> = {
  numOfAttempts: 10,
  maxDelay: 10000,
  retry: (e, attemptNumber: number) => {
    logger.warn(e);
    logger.info(
      `🤡 We'll allow some errors during start-up, retrying attempt ${attemptNumber}...`
    );
    return true;
  },
};

// eslint-disable-next-line @typescript-eslint/require-await
export const init = async () => {
  initClient();
  const l1BlockNumber = await backOff(async () => {
    return await getLatestHeight();
  }, backOffOptions);
  logger.info(`ETH: initialized, currently on height ${l1BlockNumber}`);

  return {
    id: "NC",
    // eslint-disable-next-line @typescript-eslint/require-await
    shutdownCb: async () => {
      logger.info("ETH: shutting down...");
      if (stopContractWatching) stopContractWatching();
      else logger.warn("ETH: stopContractWatching not set");
      logger.info("ETH: stopped watching contracts");
    },
  };
};

let stopContractWatching: () => void;

export const startPolling = async (
  l1ContractAddresses: ConnectedToL2Event["nodeInfo"]["l1ContractAddresses"]
) => {
  logger.info(`ETH: start polling: ${JSON.stringify(l1ContractAddresses)}`);
  initContracts(l1ContractAddresses);
  stopContractWatching = watchContractsEvents();
  await queryStakingStateAndEmitUpdates();
};
