import { Contract, DeploySentTx, Fr, waitForPXE } from "@aztec/aztec.js";
import { logger } from "../../logger.js";
import { getAztecNodeClient, getPxe, getWallets } from "../pxe.js";
import {
  deployContract,
  logAndWaitForTx,
  registerContractClassArtifact,
  verifyContractInstanceDeployment,
} from "./utils/index.js";
import {
  EasyPrivateVotingContract,
  EasyPrivateVotingContractArtifact,
} from "@aztec/noir-contracts.js/EasyPrivateVoting";
import * as contractArtifactJson from "@aztec/noir-contracts.js/artifacts/easy_private_voting_contract-EasyPrivateVoting" assert { type: "json" };

export async function run() {
  logger.info("===== VOTING CONTRACT =====");
  const pxe = getPxe();
  await waitForPXE(pxe);
  const namedWallets = getWallets();

  const deployerWallet = namedWallets.alice;
  const votingAdmin = namedWallets.alice.getAddress();

  const contractLoggingName = "Voting Contract";
  const contract = await deployContract({
    contractLoggingName,
    deployFn: (): DeploySentTx<EasyPrivateVotingContract> =>
      EasyPrivateVotingContract.deploy(deployerWallet, votingAdmin).send(),
    broadcastWithWallet: deployerWallet, // NOTE: comment this out to not broadcast
    node: getAztecNodeClient(),
  });
  registerContractClassArtifact(
    contractLoggingName,
    contractArtifactJson,
    contract.instance.contractClassId.toString(),
    contract.instance.version
  )
  .catch((err) => {
    logger.error(err);
  });

  verifyContractInstanceDeployment(
    contractLoggingName,
    contractArtifactJson,
    contract.instance.address.toString(),
    contract.instance.publicKeys.toString(),
    contract.instance.deployer.toString(),
    contract.instance.salt.toString(),
    [votingAdmin.toString()]
  ).catch((err) => {
    logger.error(err);
  });

  const votingContractAlice = await Contract.at(
    contract.address,
    EasyPrivateVotingContractArtifact,
    namedWallets.alice
  );
  const votingContractBob = await Contract.at(
    contract.address,
    EasyPrivateVotingContractArtifact,
    namedWallets.bob
  );
  const votingContractCharlie = await Contract.at(
    contract.address,
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

  const votesA = (await contract.methods
    .get_vote(candidateA)
    .simulate()) as bigint;
  const votesB = (await contract.methods
    .get_vote(candidateB)
    .simulate()) as bigint;

  logger.info(`  Votes for candidate 1: ${votesA}`);
  logger.info(`  Votes for candidate 2: ${votesB}`);
}
