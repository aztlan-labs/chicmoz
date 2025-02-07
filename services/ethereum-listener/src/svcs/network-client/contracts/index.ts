/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FeeJuicePortalAbi,
  InboxAbi,
  OutboxAbi,
  RegistryAbi,
  RollupAbi,
} from "@aztec/l1-artifacts";
import { ChicmozChainInfo } from "@chicmoz-pkg/types";
import { PublicClient } from "viem";
import { logger } from "../../../logger.js";
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

export const getL1Contracts = (): AztecContracts => {
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

export const watchContractsEvents = (): UnwatchCallback => {
  const contracts = getL1Contracts();
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
      unwatches.forEach((unwatch) => unwatch());
    };
  });

  return () => {
    unwatches.forEach((unwatch) => unwatch());
  };
};
