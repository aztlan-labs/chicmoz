import { ChicmozChainInfoEvent } from "@chicmoz-pkg/message-registry";
import { MicroserviceBaseSvc } from "@chicmoz-pkg/microservice-base";
import { IBackOffOptions, backOff } from "exponential-backoff";
import {
  ETHEREUM_HTTP_RPC_URL,
  ETHEREUM_WS_RPC_URL,
} from "../../environment.js";
import { logger } from "../../logger.js";
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
};

let stopContractWatching: () => void;

export const startPolling = async (
  l1ContractAddresses: ChicmozChainInfoEvent["chainInfo"]["l1ContractAddresses"]
) => {
  logger.info(`ETH: start polling: ${JSON.stringify(l1ContractAddresses)}`);
  initContracts(l1ContractAddresses);
  stopContractWatching = watchContractsEvents();
  await queryStakingStateAndEmitUpdates();
};

export const ethereumNetworkClient: MicroserviceBaseSvc = {
  svcId: "EthereuemNetworkClient",
  init,
  health: () => true,
  // eslint-disable-next-line @typescript-eslint/require-await
  shutdown: async () => {
    if (stopContractWatching) stopContractWatching();
    else logger.warn("ETH: stopContractWatching not set");
  },
  getConfigStr: () =>
    `ETH\n${JSON.stringify({ ETHEREUM_HTTP_RPC_URL, ETHEREUM_WS_RPC_URL })}`,
};
