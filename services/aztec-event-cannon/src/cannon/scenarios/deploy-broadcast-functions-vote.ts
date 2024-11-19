import { Contract, DeploySentTx, Fr, waitForPXE } from "@aztec/aztec.js";
import {
  EasyPrivateVotingContract,
  EasyPrivateVotingContractArtifact,
} from "../../artifacts/EasyPrivateVoting.js";
import { logger } from "../../logger.js";
import { getPxe, getWallets } from "../pxe.js";
import { deployContract, logAndWaitForTx } from "./utils/index.js";

export async function run() {
  logger.info("VOTING CONTRACT - deploy & broadcast functions");
  const pxe = getPxe();
  await waitForPXE(pxe);
  const namedWallets = getWallets();

  const deployerWallet = namedWallets.alice;
  const votingAdmin = namedWallets.alice.getAddress();

  const votingContractDeployer = await deployContract({
    contractLoggingName: "Voting Contract",
    deployFn: (): DeploySentTx<EasyPrivateVotingContract> =>
      EasyPrivateVotingContract.deploy(deployerWallet, votingAdmin).send(),
    broadcastWithWallet: deployerWallet,
  });

  const votingContractAlice = await Contract.at(
    votingContractDeployer.address,
    EasyPrivateVotingContractArtifact,
    namedWallets.alice
  );
  const votingContractBob = await Contract.at(
    votingContractDeployer.address,
    EasyPrivateVotingContractArtifact,
    namedWallets.bob
  );
  const votingContractCharlie = await Contract.at(
    votingContractDeployer.address,
    EasyPrivateVotingContractArtifact,
    namedWallets.charlie
  );

  const candidateA = new Fr(1);
  const candidateB = new Fr(2);

  await Promise.all([
    logAndWaitForTx(
      votingContractAlice.methods.cast_vote(candidateA).send(),
      "Cast vote 1 - candidate A"
    ),
    logAndWaitForTx(
      votingContractBob.methods.cast_vote(candidateA).send(),
      "Cast vote 2 - candidate A"
    ),
    await logAndWaitForTx(
      votingContractCharlie.methods.cast_vote(candidateB).send(),
      "Cast vote 3 - candidate B"
    ),
  ]);

  const votesA = (await votingContractDeployer.methods
    .get_vote(candidateA)
    .simulate()) as bigint;
  const votesB = (await votingContractDeployer.methods
    .get_vote(candidateB)
    .simulate()) as bigint;

  logger.info(`  Votes for candidate 1: ${votesA}`);
  logger.info(`  Votes for candidate 2: ${votesB}`);
}
