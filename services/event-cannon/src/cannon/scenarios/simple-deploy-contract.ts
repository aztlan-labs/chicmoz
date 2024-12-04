import { DeploySentTx, waitForPXE } from "@aztec/aztec.js";
import { logger } from "../../logger.js";
import { getAztecNodeClient, getPxe, getWallets } from "../pxe.js";
import { deployContract } from "./utils/index.js";
import { EasyPrivateVotingContract } from "@aztec/noir-contracts.js";
import {
  ContractClassRegisteredEvent,
  ContractInstanceDeployedEvent,
} from "@aztec/circuits.js";
import { ProtocolContractAddress } from "@aztec/protocol-contracts";

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
      const encryptedBlockLogs = b.body.txEffects.flatMap((txEffect) =>
        txEffect.encryptedLogs.unrollLogs()
      );
      const contractInstances =
        ContractInstanceDeployedEvent.fromLogs(encryptedBlockLogs);

      const contractClassLogs = b.body.txEffects.flatMap((txEffect) =>
        txEffect.contractClassLogs.unrollLogs()
      );
      const contractClasses = ContractClassRegisteredEvent.fromLogs(
        contractClassLogs,
        ProtocolContractAddress.ContractClassRegisterer
      );

      logger.info(
        JSON.stringify({
          contractClasses,
          contractInstances,
        })
      );
    }
  }
}
