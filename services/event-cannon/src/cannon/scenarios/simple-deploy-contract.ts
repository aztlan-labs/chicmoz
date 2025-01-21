import {
  DeploySentTx,
  NoirCompiledContract,
  PublicKeys,
  getContractInstanceFromDeployParams,
  loadContractArtifact,
  waitForPXE,
} from "@aztec/aztec.js";
import { EasyPrivateVotingContract } from "@aztec/noir-contracts.js/EasyPrivateVoting";
import * as contractArtifactJson from "@aztec/noir-contracts.js/artifacts/easy_private_voting_contract-EasyPrivateVoting" assert { type: "json" };
import assert from "assert";
import { logger } from "../../logger.js";
import { getAztecNodeClient, getPxe, getWallets } from "../pxe.js";
import {
  deployContract,
  registerContractClassArtifact,
} from "./utils/index.js";

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

  const contractLoggingName = "Voting Contract";

  const contract = await deployContract({
    contractLoggingName,
    deployFn: (): DeploySentTx<EasyPrivateVotingContract> => sentTx,
    node: getAztecNodeClient(),
  });

  // validation logic
  const artifact = loadContractArtifact(
    (contractArtifactJson as unknown as { default: NoirCompiledContract }).default
  );
  const tempInst = getContractInstanceFromDeployParams(artifact, {
    constructorArgs: [votingAdmin],
    deployer: deployerWallet.getAddress(),
    skipArgsDecoding: false,
    salt: contract.instance.salt,
    publicKeys: contract.instance.publicKeys,
  });
  if (tempInst === undefined) throw new Error("Initialization hash mismatch");

  assert(tempInst.contractClassId.equals(contract.instance.contractClassId));
  assert(
    tempInst.initializationHash.equals(contract.instance.initializationHash)
  );
  assert(tempInst.salt.equals(contract.instance.salt));
  assert(tempInst.deployer.equals(contract.instance.deployer));
  assert(tempInst.version === contract.instance.version);
  assert(tempInst.publicKeys.equals(contract.instance.publicKeys));

  const buf = contract.instance.publicKeys.toBuffer();
  const str = buf.toString("hex");
  const buf2 = Buffer.from(str, "hex");
  assert(PublicKeys.fromBuffer(buf2).equals(contract.instance.publicKeys));

  // validation logic end

  registerContractClassArtifact(
    contractLoggingName,
    contractArtifactJson,
    contract.instance.contractClassId.toString(),
    contract.instance.version
  ).catch((err) => {
    logger.error(err);
  });
}
