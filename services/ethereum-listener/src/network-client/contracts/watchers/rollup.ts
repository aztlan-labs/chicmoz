import {
  chicmozL1L2BlockProposedSchema,
  chicmozL1L2ProofVerifiedSchema,
} from "@chicmoz-pkg/types";
import { emit } from "../../../events/index.js";
import { logger } from "../../../logger.js";
import { RollupContract, UnwatchCallback } from "../utils.js";
import { asyncForEach } from "./index.js";

const emptyFilterArgs = {};
const onError = (name: string) => (e: Error) => {
  logger.error(`💀 💀${name}: ${e.stack}`);
};
const onLogs = (name: string) => (logs: unknown[]) => {
  logger.info(`💀${name} UNHANDLED!`);
  logger.info(logs);
};

export const watchRollupEvents = (
  contract: RollupContract,
  startFromHeight: bigint
): UnwatchCallback => {
  const unwatches: UnwatchCallback[] = [];
  unwatches.push(
    contract.watchEvent.L2BlockProposed(emptyFilterArgs, {
      fromBlock: startFromHeight,
      onError: onError("L2BlockProposed"),
      onLogs: (logs) => {
        asyncForEach(logs, async (log) => {
          await emit.l2BlockProposed(
            chicmozL1L2BlockProposedSchema.parse({
              l1ContractAddress: log.address,
              l1BlockNumber: log.blockNumber,
              l1BlockHash: log.blockHash,
              l2BlockNumber: log.args.blockNumber,
              archive: log.args.archive,
              l1BlockTimestamp: Number.parseInt(
                (log as unknown as { blockTimestamp: `0x${string}` })
                  .blockTimestamp,
                16
              ),
            })
          );
        }).catch((e) => {
          logger.error(`💀 Rollup blockProposed: ${(e as Error).stack}`);
        });
      },
    })
  );
  unwatches.push(
    contract.watchEvent.L2ProofVerified(emptyFilterArgs, {
      fromBlock: startFromHeight,
      onError: onError("L2ProofVerified"),
      onLogs: (logs) => {
        asyncForEach(logs, async (log) => {
          await emit.l2ProofVerified(
            chicmozL1L2ProofVerifiedSchema.parse({
              l1ContractAddress: log.address,
              l1BlockNumber: log.blockNumber,
              l1BlockHash: log.blockHash,
              l2BlockNumber: log.args.blockNumber,
              proverId: log.args.proverId,
              l1BlockTimestamp: Number.parseInt(
                (log as unknown as { blockTimestamp: `0x${string}` })
                  .blockTimestamp,
                16
              ),
            })
          );
        }).catch((e) => {
          logger.error(`💀 Rollup proofVerified: ${(e as Error).stack}`);
        });
      },
    })
  );
  // staking events
  unwatches.push(
    contract.watchEvent.Deposit(emptyFilterArgs, {
      fromBlock: startFromHeight,
      onError: onError("Deposit"),
      onLogs: onLogs("Deposit"),
    })
  );
  unwatches.push(
    contract.watchEvent.Slashed(emptyFilterArgs, {
      fromBlock: startFromHeight,
      onError: onError("Slashed"),
      onLogs: onLogs("Slashed"),
    })
  );
  unwatches.push(
    contract.watchEvent.WithdrawInitiated(emptyFilterArgs, {
      fromBlock: startFromHeight,
      onError: onError("WithdrawInitiated"),
      onLogs: onLogs("WithdrawInitiated"),
    })
  );
  unwatches.push(
    contract.watchEvent.WithdrawFinalised(emptyFilterArgs, {
      fromBlock: startFromHeight,
      onError: onError("WithdrawFinalised"),
      onLogs: onLogs("WithdrawFinalised"),
    })
  );

  const unwatchAll = () => unwatches.forEach((unwatch) => unwatch());

  return unwatchAll;
};
