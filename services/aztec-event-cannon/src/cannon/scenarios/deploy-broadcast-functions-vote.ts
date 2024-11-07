import { Fr, waitForPXE } from "@aztec/aztec.js";
import { EasyPrivateVotingContract } from "../../artifacts/EasyPrivateVoting.js";
import { logger } from "../../logger.js";
import { getPxe } from "../pxe.js";
import { broadcastFunctions, deployContract, getNewSchnorrAccount } from "./utils/index.js";

export async function run() {
  logger.info("VOTING CONTRACT - deploy & broadcast functions");
  const pxe = getPxe();
  await waitForPXE(pxe);
  const secretKey = Fr.random();
  const salt = Fr.random();
  const { wallet, address } = await getNewSchnorrAccount({
    pxe,
    secretKey,
    salt,
  });

  const deployerWallet = wallet;
  const votingAdmin = address;

  const votingContract = await deployContract({
    contractLoggingName: "Voting Contract",
    contract: EasyPrivateVotingContract,
    contractDeployArgs: [deployerWallet, votingAdmin],
  });

  await broadcastFunctions({ wallet, contract: votingContract });
  // TODO: add actual voting function calls
}
