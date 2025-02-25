/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from "../../logger.js";
import { getPendingHeight } from "../../svcs/database/controllers.js";
import { AztecContract, AztecContracts, UnwatchCallback } from "./utils.js";
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

export const watchAllContractsEvents= async ({
  contracts,
}: {
  contracts: AztecContracts;
}): Promise<UnwatchCallback> => {
  const startFromHeight = await getPendingHeight();
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
