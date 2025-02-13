import { Contract, DeploySentTx, waitForPXE } from "@aztec/aztec.js";
import { logger } from "../../logger.js";
import { getAztecNodeClient, getPxe, getWallets } from "../pxe.js";
import {
  deployContract,
  logAndWaitForTx,
  registerContractClassArtifact,
} from "./utils/index.js";
import { TokenContract } from "@aztec/noir-contracts.js/Token";
import * as tokenContractArtifactJson from "@aztec/noir-contracts.js/artifacts/token_contract-Token" assert { type: "json" };

export async function run() {
  logger.info("===== TOKEN CONTRACT =====");
  const pxe = getPxe();
  await waitForPXE(pxe);
  const namedWallets = getWallets();

  const deployerWallet = namedWallets.alice;
  const tokenAdmin = namedWallets.alice.getAddress();

  const contractLoggingName = "Token Contract";
  const tokenContract = await deployContract({
    contractLoggingName,
    deployFn: (): DeploySentTx<TokenContract> => {
      return TokenContract.deploy(
        deployerWallet,
        tokenAdmin,
        "lol",
        "LOL",
        9,
      ).send();
    },
    node: getAztecNodeClient(),
  });

  registerContractClassArtifact(
    contractLoggingName,
    tokenContractArtifactJson,
    tokenContract.instance.contractClassId.toString(),
    tokenContract.instance.version,
  ).catch((err) => {
    logger.error(err);
  });

  await Promise.all([
    logAndWaitForTx(
      tokenContract.methods
        .mint_to_public(namedWallets.alice.getAddress(), 1000)
        .send(),
      "Mint to Alice",
    ),
    logAndWaitForTx(
      tokenContract.methods
        .mint_to_public(namedWallets.bob.getAddress(), 1000)
        .send(),
      "Mint to Bob",
    ),
    logAndWaitForTx(
      tokenContract.methods
        .mint_to_public(namedWallets.charlie.getAddress(), 1000)
        .send(),
      "Mint to Charlie",
    ),
  ]);
  const [balanceAlice, balanceBob, balanceCharlie] = await Promise.all([
    tokenContract.methods
      .balance_of_public(namedWallets.alice.getAddress())
      .simulate()
      .then((balance) => balance as bigint),
    tokenContract.methods
      .balance_of_public(namedWallets.bob.getAddress())
      .simulate()
      .then((balance) => balance as bigint),
    tokenContract.methods
      .balance_of_public(namedWallets.charlie.getAddress())
      .simulate()
      .then((balance) => balance as bigint),
  ]);
  logger.info(`Alice balance: ${balanceAlice}`);
  logger.info(`Bob balance: ${balanceBob}`);
  logger.info(`Charlie balance: ${balanceCharlie}`);

  const aliceContract = (await Contract.at(
    tokenContract.address,
    TokenContract.artifact,
    namedWallets.alice,
  )) as TokenContract;

  const bobsTokenContract = (await Contract.at(
    tokenContract.address,
    TokenContract.artifact,
    namedWallets.bob,
  )) as TokenContract;

  const charliesTokenContract = (await Contract.at(
    tokenContract.address,
    TokenContract.artifact,
    namedWallets.charlie,
  )) as TokenContract;

  let bobNonce = 0;
  await logAndWaitForTx(
    bobsTokenContract.methods
      .transfer_in_public(
        namedWallets.bob.getAddress(),
        namedWallets.alice.getAddress(),
        100,
        bobNonce,
      )
      .send(),
    "Public transfer from Alice to Bob",
  );
  bobNonce++;

  const [balanceAliceAfter, balanceBobAfter] = await Promise.all([
    tokenContract.methods
      .balance_of_public(namedWallets.alice.getAddress())
      .simulate()
      .then((balance) => balance as bigint),
    tokenContract.methods
      .balance_of_public(namedWallets.bob.getAddress())
      .simulate()
      .then((balance) => balance as bigint),
  ]);

  logger.info(`Alice balance after: ${balanceAliceAfter}`);
  logger.info(`Bob balance after: ${balanceBobAfter}`);

  await logAndWaitForTx(
    charliesTokenContract.methods
      .transfer_to_private(namedWallets.alice.getAddress(), 100)
      .send(),
    "Public to private transfer from Charlie to Alice",
  );

  let aliceNonce = 0;
  await logAndWaitForTx(
    aliceContract.methods
      .transfer_in_private(
        namedWallets.alice.getAddress(),
        namedWallets.bob.getAddress(),
        100,
        aliceNonce,
      )
      .send(),
    "Private transfer from Bob to Alice",
  );
  aliceNonce++;
  logger.info(`Private transfer from Bob to Alice`);
  const [
    balancePrivateAlice,
    balancePublicAlice,
    balancePrivateBob,
    balancePublicBob,
    balancePrivateCharlie,
    balancePublicCharlie,
  ] = await Promise.all([
    tokenContract.methods
      .balance_of_private(namedWallets.alice.getAddress())
      .simulate()
      .then((balance) => balance as bigint),
    tokenContract.methods
      .balance_of_public(namedWallets.alice.getAddress())
      .simulate()
      .then((balance) => balance as bigint),
    tokenContract.methods
      .balance_of_private(namedWallets.bob.getAddress())
      .simulate()
      .then((balance) => balance as bigint),
    tokenContract.methods
      .balance_of_public(namedWallets.bob.getAddress())
      .simulate()
      .then((balance) => balance as bigint),
    tokenContract.methods
      .balance_of_private(namedWallets.charlie.getAddress())
      .simulate()
      .then((balance) => balance as bigint),
    tokenContract.methods
      .balance_of_public(namedWallets.charlie.getAddress())
      .simulate()
      .then((balance) => balance as bigint),
  ]);
  logger.info(`Alice private balance: ${balancePrivateAlice}`);
  logger.info(`Alice public balance: ${balancePublicAlice}`);
  logger.info(`Bob private balance: ${balancePrivateBob}`);
  logger.info(`Bob public balance: ${balancePublicBob}`);
  logger.info(`Charlie private balance: ${balancePrivateCharlie}`);
  logger.info(`Charlie public balance: ${balancePublicCharlie}`);
}
