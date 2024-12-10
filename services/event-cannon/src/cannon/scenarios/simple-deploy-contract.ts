import { DeploySentTx, waitForPXE } from "@aztec/aztec.js";
import { logger } from "../../logger.js";
import { getAztecNodeClient, getPxe, getWallets } from "../pxe.js";
import { deployContract } from "./utils/index.js";
import { EasyPrivateVotingContract } from "@aztec/noir-contracts.js";
import {
  ContractClassRegisteredEvent,
  ContractInstanceDeployedEvent,
} from "@aztec/protocol-contracts";
import assert from "assert";

export async function run() {
  logger.info("===== SIMPLE DEPLOY CONTRACT =====");
  const pxe = getPxe();
  await waitForPXE(pxe);
  const namedWallets = getWallets();

  const deployerWallet = namedWallets.alice;
  const votingAdmin = namedWallets.alice.getAddress();

  const sentTx = EasyPrivateVotingContract.deploy(
    deployerWallet,
    votingAdmin
  ).send();

  await deployContract({
    contractLoggingName: "Voting Contract",
    deployFn: (): DeploySentTx<EasyPrivateVotingContract> => sentTx,
  });

  const blockNumber = (await sentTx.getReceipt()).blockNumber;
  const node = getAztecNodeClient();
  if (blockNumber && blockNumber > 0) {
    const b = await node.getBlock(blockNumber);
    if (b) {
      const privateLogs = b.body.txEffects.flatMap(
        (txEffect) => txEffect.privateLogs
      );
      const contractInstances = privateLogs
        .filter((log) =>
          ContractInstanceDeployedEvent.isContractInstanceDeployedEvent(log)
        )
        .map((log) => ContractInstanceDeployedEvent.fromLog(log))
        .map((e) => e.toContractInstance());

      const contractClassLogs = b.body.txEffects
        .flatMap((txEffect) => (txEffect ? [txEffect.contractClassLogs] : []))
        .flatMap((txLog) => txLog.unrollLogs());

      const contractClasses = contractClassLogs
        .filter((log) =>
          ContractClassRegisteredEvent.isContractClassRegisteredEvent(log.data)
        )
        .map((log) => ContractClassRegisteredEvent.fromLog(log.data))
        .map((e) => e.toContractClassPublic());
      logger.info(
        JSON.stringify({
          contractClasses,
          contractInstances,
        })
      );
      assert(contractClasses.length > 1, "Contract classes length is 0!!");
      assert(contractInstances.length > 1, "Contract instances length is 0!!");
    }
  }
}
