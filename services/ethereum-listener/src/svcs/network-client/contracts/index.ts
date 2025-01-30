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
import { watchRollupEvents } from "./rollup-watcher.js";
import {
  AztecContract,
  AztecContracts,
  UnwatchCallback,
  getTypedContract,
} from "./utils.js";

let l1Contracts: AztecContracts | undefined = undefined;

type WatchEventFunction = (
  args: Record<string, unknown>,
  options: { onLogs: (logs: unknown[]) => void; onError: (e: Error) => void }
) => UnwatchCallback;

type ContractEventMap = Record<string, WatchEventFunction>;

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

const watchContractEventsGeneric = <T extends AztecContract>({
  name,
  contract,
}: {
  name: string;
  contract: T;
}): UnwatchCallback => {
  const watchEvent = contract.watchEvent as unknown as ContractEventMap;
  const entries = Object.entries(watchEvent);
  const unwatches = entries.map(([eventName, watcher]) => {
    logger.info(`Watching ${name}.${eventName}`);
    return watcher(
      {},
      {
        onError: (e) => {
          logger.error(`${name}.${eventName}: ${e.stack}`);
        },
        onLogs: (logs) => {
          logger.info(`${name}.${eventName}: ${JSON.stringify(logs)}`);
        },
      }
    );
  });

  return () => unwatches.forEach((unwatch) => unwatch());
};

export const watchContractsEvents = (): UnwatchCallback => {
  const contracts = getL1Contracts();
  const unwatches = (
    Object.entries(contracts) as [keyof AztecContracts, AztecContract][]
  ).map(([name, contract]) => {
    logger.info(`Watching ${name}`);
    const specificWatcher = contractWatchers[name];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (specificWatcher) return specificWatcher(contract as any);

    return watchContractEventsGeneric({
      name,
      contract,
    });
  });

  return () => {
    unwatches.forEach((unwatch) => unwatch());
  };
};
