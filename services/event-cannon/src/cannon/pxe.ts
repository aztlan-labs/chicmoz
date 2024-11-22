import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";
import {
  AccountWallet,
  PXE,
  createPXEClient,
  waitForPXE,
} from "@aztec/aztec.js";
import { AZTEC_RPC_URL } from "../environment.js";
import { logger } from "../logger.js";

let pxe: PXE;
let namedWallets: {
  alice: AccountWallet;
  bob: AccountWallet;
  charlie: AccountWallet;
} | null = null;

export const setup = async () => {
  pxe = createPXEClient(AZTEC_RPC_URL);
  await waitForPXE(pxe);
  const info = await pxe.getPXEInfo();
  logger.info(JSON.stringify(info));
  const [alice, bob, charlie] = await getInitialTestAccountsWallets(pxe);
  namedWallets = {
    alice,
    bob,
    charlie,
  };
};

export const getPxe = () => {
  if (!pxe) throw new Error("PXE not initialized");
  return pxe;
};

export const getWallets = () => {
  if (!namedWallets) throw new Error("Wallets not initialized");
  return namedWallets;
};
