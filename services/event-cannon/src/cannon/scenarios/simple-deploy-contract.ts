import { DeploySentTx, waitForPXE } from "@aztec/aztec.js";
import { logger } from "../../logger.js";
import { getAztecNodeClient, getPxe, getWallets } from "../pxe.js";
import { deployContract } from "./utils/index.js";
import { EasyPrivateVotingContract } from "@aztec/noir-contracts.js/EasyPrivateVoting";

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
    node: getAztecNodeClient(),
  });
}
