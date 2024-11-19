import { DeploySentTx, waitForPXE } from "@aztec/aztec.js";
import { TokenContract } from "../../artifacts/Token.js";
import { logger } from "../../logger.js";
import { getPxe, getWallets } from "../pxe.js";
import { deployContract, logAndWaitForTx } from "./utils/index.js";

export async function run() {
  logger.info("TOKEN CONTRACT - deploy & interact functions");
  const pxe = getPxe();
  await waitForPXE(pxe);
  const namedWallets = getWallets();

  const deployerWallet = namedWallets.alice;
  const tokenAdmin = namedWallets.alice.getAddress();

  const tokenContract = await deployContract({
    contractLoggingName: "Token Contract",
    deployFn: (): DeploySentTx<TokenContract> => {
      return TokenContract.deploy(
        deployerWallet,
        tokenAdmin,
        "lol",
        "LOL",
        9
      ).send();
    },
  });
  await Promise.all([
    logAndWaitForTx(
      tokenContract.methods
        .mint_to_public(namedWallets.alice.getAddress(), 1000)
        .send(),
      "Mint to Alice"
    ),
    logAndWaitForTx(
      tokenContract.methods
        .mint_to_public(namedWallets.bob.getAddress(), 1000)
        .send(),
      "Mint to Bob"
    ),
    logAndWaitForTx(
      tokenContract.methods
        .mint_to_public(namedWallets.charlie.getAddress(), 1000)
        .send(),
      "Mint to Charlie"
    ),
  ]);
  const [balanceAlice, balanceBob, balanceCharlie] = await Promise.all([
    tokenContract.methods
      .balance_of_public(namedWallets.alice.getAddress())
      .simulate().then((balance) => balance as bigint),
    tokenContract.methods
      .balance_of_public(namedWallets.bob.getAddress())
      .simulate().then((balance) => balance as bigint),
    tokenContract.methods
      .balance_of_public(namedWallets.charlie.getAddress())
      .simulate().then((balance) => balance as bigint),
  ]);
  logger.info(`Alice balance: ${balanceAlice}`);
  logger.info(`Bob balance: ${balanceBob}`);
  logger.info(`Charlie balance: ${balanceCharlie}`);
}
