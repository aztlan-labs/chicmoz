import { waitForPXE } from "@aztec/aztec.js";
import { TokenContract } from "../../artifacts/Token.js";
import { logger } from "../../logger.js";
import { getPxe, getWallets } from "../pxe.js";
import { deployContract } from "./utils/index.js";

export async function run() {
  logger.info("TOKEN CONTRACT - deploy & interact functions");
  const pxe = getPxe();
  await waitForPXE(pxe);
  const namedWallets = getWallets();

  const deployerWallet = namedWallets.alice;
  const tokenAdmin = namedWallets.alice.getAddress();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tokenContract = await deployContract({
    contractLoggingName: "Token Contract",
    deployFn: () => {
      return TokenContract.deploy(
        deployerWallet,
        tokenAdmin,
        "lol",
        "LOL",
        9
      ).send();
    },
  });
}
