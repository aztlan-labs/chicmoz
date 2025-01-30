import { logger } from "../../../logger.js";
import { RollupContract, UnwatchCallback } from "./utils.js";

const emptyFilterArgs = {};
const onError = (name: string) => (e: Error) => {
  logger.error(`💀 💀${name}: ${e.stack}`);
};
const onLogs = (name: string) => (logs: unknown[]) => {
  logger.info(`💀${name} UNHANDLED!`);
  logger.info(logs);
};

export const watchRollupEvents = (
  contract: RollupContract
): UnwatchCallback => {
  const unwatches: UnwatchCallback[] = [];
  unwatches.push(
    contract.watchEvent.L2BlockProposed(emptyFilterArgs, {
      fromBlock: 1n,
      onError: onError("L2BlockProposed"),
      onLogs: (logs) => {
        logs.forEach((log) => {
          logger.info(`L2BlockProposed
l2block number: ${log.args.blockNumber?.toString()}
l2archive:      ${log.args.archive}
l1block number: ${log.blockNumber}
all keys:       ${Object.keys(log).join(", ")}`);
        });
      },
    })
  );
  unwatches.push(
    contract.watchEvent.L2ProofVerified(emptyFilterArgs, {
      fromBlock: 1n,
      onError: onError("L2ProofVerified"),
      onLogs: onLogs("L2ProofVerified"),
    })
  );
  // staking events
  unwatches.push(
    contract.watchEvent.Deposit(emptyFilterArgs, {
      fromBlock: 1n,
      onError: onError("Deposit"),
      onLogs: onLogs("Deposit"),
    })
  );
  unwatches.push(
    contract.watchEvent.Slashed(emptyFilterArgs, {
      fromBlock: 1n,
      onError: onError("Slashed"),
      onLogs: onLogs("Slashed"),
    })
  );
  unwatches.push(
    contract.watchEvent.WithdrawInitiated(emptyFilterArgs, {
      fromBlock: 1n,
      onError: onError("WithdrawInitiated"),
      onLogs: onLogs("WithdrawInitiated"),
    })
  );
  unwatches.push(
    contract.watchEvent.WithdrawFinalised(emptyFilterArgs, {
      fromBlock: 1n,
      onError: onError("WithdrawFinalised"),
      onLogs: onLogs("WithdrawFinalised"),
    })
  );

  const unwatchAll = () => unwatches.forEach((unwatch) => unwatch());

  return unwatchAll;
};
