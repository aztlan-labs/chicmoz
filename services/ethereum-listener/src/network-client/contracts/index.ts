/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FeeJuicePortalAbi,
  InboxAbi,
  OutboxAbi,
  RegistryAbi,
  RollupAbi,
} from "@aztec/l1-artifacts";
import { ChicmozChainInfo, jsonStringify } from "@chicmoz-pkg/types";
import { PublicClient } from "viem";
import { logger } from "../../logger.js";
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

let l1Contracts: AztecContracts | undefined = undefined;

const contractWatchers: {
  [K in keyof AztecContracts]?: (
    contract: AztecContracts[K]
  ) => UnwatchCallback;
} = {
  rollup: watchRollupEvents as (
    contract: AztecContracts["rollup"]
  ) => UnwatchCallback,
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getL1Contracts = async (): Promise<AztecContracts> => {
  // TODO: get contracts from DB
  if (!l1Contracts) throw new Error("Contracts not initialized");
  return l1Contracts;
};

export const init = (
  l1ContractAddresses: ChicmozChainInfo["l1ContractAddresses"],
  publicClient: PublicClient
) => {
  if (l1Contracts) return;
  l1Contracts = {
    rollup: getTypedContract(
      RollupAbi,
      l1ContractAddresses.rollupAddress as `0x${string}`,
      publicClient
    ),
    registry: getTypedContract(
      RegistryAbi,
      l1ContractAddresses.registryAddress as `0x${string}`,
      publicClient
    ),
    inbox: getTypedContract(
      InboxAbi,
      l1ContractAddresses.inboxAddress as `0x${string}`,
      publicClient
    ),
    outbox: getTypedContract(
      OutboxAbi,
      l1ContractAddresses.outboxAddress as `0x${string}`,
      publicClient
    ),
    feeJuicePortal: getTypedContract(
      FeeJuicePortalAbi,
      l1ContractAddresses.feeJuiceAddress as `0x${string}`,
      publicClient
    ),
  };
};

export const watchContractsEvents = async (): Promise<UnwatchCallback> => {
  // TODO: getStartFromBlock from DB
  const contracts = await getL1Contracts();
  const unwatches = (
    Object.entries(contracts) as [keyof AztecContracts, AztecContract][]
  ).map(([name, contract]) => {
    logger.info(`🍔 Generic watcher:  ${name}`);
    const unwatches = [
      watchContractEventsGeneric({
        name,
        contract,
      }),
    ];
    const specificWatcher = contractWatchers[name];
    if (specificWatcher) {
      logger.info(`🍟 Specific watcher: ${name}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      unwatches.push(specificWatcher(contract as any));
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

let currentBlockNumber = 1n;

export const getFinalizedContractEvents = async () => {
  logger.info(`🐻 Getting finalized events from block ${currentBlockNumber}`);
  const contracts = await getL1Contracts();
  // TODO: getStartFromBlock from DB
  for (const contract of Object.values(contracts)) {
    const client = getPublicClient();
    const events = await client.getContractEvents({
      fromBlock: currentBlockNumber,
      toBlock: "finalized",
      address: contract.address,
      abi: contract.abi,
    });
    for (const event of events)
      logger.info(`🐻 Finalized event: ${jsonStringify(event)}`);
    if (events.at(-1)?.blockNumber ?? 0 > currentBlockNumber)
      currentBlockNumber = BigInt(events.at(-1)!.blockNumber) + 1n;
  }
};
