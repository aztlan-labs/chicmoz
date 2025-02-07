import { chicmozL1GenericContractEventSchema } from "@chicmoz-pkg/types";
import { Log } from "viem";
import { emit } from "../../../../events/index.js";
import { logger } from "../../../../logger.js";
import { AztecContract, UnwatchCallback } from "../utils.js";

export * from "./rollup.js";

export const asyncForEach = async <T>(
  array: T[],
  callback: (value: T) => Promise<void>
) => {
  for (const item of array) await callback(item);
};

type WatchEventFunction = (
  args: Record<string, unknown>,
  options: {
    onLogs: (
      logs: (Log & {
        eventName: string | null;
        args: Record<string, unknown> | null;
      })[]
    ) => void;
    onError: (e: Error) => void;
    fromBlock: bigint;
  }
) => UnwatchCallback;

type ContractEventMap = Record<string, WatchEventFunction>;

export const watchContractEventsGeneric = <T extends AztecContract>({
  name,
  contract,
}: {
  name: string;
  contract: T;
}): UnwatchCallback => {
  const eventNames = contract.abi.filter(
    (item) => item.type === "event" && typeof item.name === "string"
  );
  const watchEvents = contract.watchEvent as unknown as ContractEventMap;

  const unwatches = eventNames.map((event) => {
    const eventName = (event as { name: string }).name;
    logger.info(`🍔🍔 ${name}.${eventName}`);
    return watchEvents[eventName](
      {},
      {
        fromBlock: 1n,
        onError: (e) => {
          logger.error(`🍔 ${name}.${eventName}: ${e.stack}`);
        },
        onLogs: (logs) => {
          asyncForEach(logs, async (log) => {
            await emit.genericContractEvent(
              chicmozL1GenericContractEventSchema.parse({
                l1BlockNumber: log.blockNumber,
                l1BlockHash: log.blockHash,
                l1BlockTimestamp: Number.parseInt(
                  (log as unknown as { blockTimestamp: `0x${string}` })
                    .blockTimestamp,
                  16
                ),
                l1ContractAddress: log.address,
                eventName: log.eventName,
                eventArgs: log.args,
              })
            );
          }).catch((e) => {
            logger.error(`🍔🍔 ${name}.${eventName}: ${(e as Error).stack}`);
          });
        },
      }
    );
  });

  return () => unwatches.forEach((unwatch) => unwatch());
};
