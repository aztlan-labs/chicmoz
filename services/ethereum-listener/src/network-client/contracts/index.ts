/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FeeJuicePortalAbi,
  InboxAbi,
  OutboxAbi,
  RegistryAbi,
  RollupAbi,
} from "@aztec/l1-artifacts";
import { jsonStringify } from "@chicmoz-pkg/types";
import { logger } from "../../logger.js";
import {
  getL1Contracts as dbGetL1Contracts,
  getFinalizedHeight,
  getPendingHeight,
  setFinalizedHeight,
} from "../../svcs/database/controllers.js";
import { getPublicClient } from "../client.js";
import {
  AztecContract,
  AztecContracts,
  UnwatchCallback,
  getTypedContract,
} from "./utils.js";
import {
  watchContractEventsGeneric,
  watchRollupEvents,
} from "./watchers/index.js";

const contractWatchers: {
  [K in keyof AztecContracts]?: (
    contract: AztecContracts[K],
    startFromHeight: bigint
  ) => UnwatchCallback;
} = {
  rollup: watchRollupEvents as (
    contract: AztecContracts["rollup"],
    startFromHeight: bigint
  ) => UnwatchCallback,
};

export const getL1Contracts = async (): Promise<AztecContracts> => {
  const dbContracts = await dbGetL1Contracts();
  const publicClient = getPublicClient();
  return {
    rollup: getTypedContract(
      RollupAbi,
      dbContracts.rollupAddress as `0x${string}`,
      publicClient
    ),
    registry: getTypedContract(
      RegistryAbi,
      dbContracts.registryAddress as `0x${string}`,
      publicClient
    ),
    inbox: getTypedContract(
      InboxAbi,
      dbContracts.inboxAddress as `0x${string}`,
      publicClient
    ),
    outbox: getTypedContract(
      OutboxAbi,
      dbContracts.outboxAddress as `0x${string}`,
      publicClient
    ),
    feeJuicePortal: getTypedContract(
      FeeJuicePortalAbi,
      dbContracts.feeJuiceAddress as `0x${string}`,
      publicClient
    ),
  };
};

export const watchContractsEvents = async (): Promise<UnwatchCallback> => {
  const startFromHeight = await getPendingHeight();
  const contracts = await getL1Contracts();
  const unwatches = (
    Object.entries(contracts) as [keyof AztecContracts, AztecContract][]
  ).map(([name, contract]) => {
    logger.info(`🍔 Generic watcher:  ${name}`);
    const unwatches = [
      watchContractEventsGeneric({
        name,
        contract,
        startFromHeight,
      }),
    ];
    const specificWatcher = contractWatchers[name];
    if (specificWatcher) {
      logger.info(`🍟 Specific watcher: ${name}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      unwatches.push(specificWatcher(contract as any, startFromHeight));
    }
    return () => {
      logger.info(`Unwatching events for ${name}`);
      unwatches.forEach((unwatch) => unwatch());
    };
  });

  return () => {
    unwatches.forEach((unwatch) => unwatch());
  };
};

export const getFinalizedContractEvents = async () => {
  const contracts = await getL1Contracts();
  const startFromHeight = await getFinalizedHeight();
  logger.info(`🐻 Getting finalized events from block ${startFromHeight}`);
  let heighestBlockNumber = startFromHeight;
  for (const contract of Object.values(contracts)) {
    const client = getPublicClient();
    const events = await client.getContractEvents({
      fromBlock: startFromHeight,
      toBlock: "finalized",
      address: contract.address,
      abi: contract.abi,
    });
    for (const event of events) {
      logger.info(`🐻 Finalized event: ${jsonStringify(event)}`);
      heighestBlockNumber =
        event.blockNumber && event.blockNumber > heighestBlockNumber
          ? event.blockNumber
          : heighestBlockNumber;
    }
  }
  await setFinalizedHeight(heighestBlockNumber);
};
