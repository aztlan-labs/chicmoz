import {
  AztecAddress,
  DeploySentTx,
  EthAddress,
  Fr,
  L1TokenPortalManager,
  createDebugLogger,
  deployL1Contract,
  retryUntil,
  waitForPXE,
} from "@aztec/aztec.js";
import { logger } from "../../logger.js";
import { getAztecNodeClient, getPxe, getWallets } from "../pxe.js";
import { deployContract, logAndWaitForTx, publicDeployAccounts } from "./utils/index.js";
import {
  createPublicClient,
  createWalletClient,
  getContract,
  http,
} from "viem";
import { mnemonicToAccount } from "viem/accounts";
import { foundry } from "viem/chains";
import { ETHEREUM_RPC_URL } from "../../environment.js";
import {
  TestERC20Abi,
  TestERC20Bytecode,
  TokenPortalAbi,
  TokenPortalBytecode,
} from "@aztec/l1-artifacts";
import { TokenBridgeContract, TokenContract } from "@aztec/noir-contracts.js";
import assert from "assert";

const MNEMONIC = "test test test test test test test test test test test junk";
const TOKEN_NAME = "TokenName";
const TOKEN_SYMBOL = "TokenSymbol";

export const run = async () => {
  logger.info("===== L1/L2 PUBLIC MESSAGING =====");
  const aztecNode = getAztecNodeClient();
  const pxe = getPxe();
  await waitForPXE(pxe);
  const namedWallets = getWallets();

  const wallets = [
    // NOTE: for similarity with tutorial
    namedWallets.alice,
    namedWallets.bob,
    namedWallets.charlie,
  ];
  const wallet = namedWallets.alice; // NOTE: for similarity with tutorial
  logger.info("🐰 Deploying accounts...");
  await publicDeployAccounts(wallet, wallets, pxe);

  const hdAccount = mnemonicToAccount(MNEMONIC);

  const walletClient = createWalletClient({
    account: hdAccount,
    chain: foundry,
    transport: http(ETHEREUM_RPC_URL),
  });
  const publicClient = createPublicClient({
    chain: foundry,
    transport: http(ETHEREUM_RPC_URL),
  });
  logger.info("🐰 Deploying contracts...");
  const underlyingERC20Address = await deployL1Contract(
    walletClient,
    publicClient,
    TestERC20Abi,
    TestERC20Bytecode
  ).then(({ address }) => address);
  logger.info(
    `🐰 Underlying ERC20 deployed at ${underlyingERC20Address.toString()}`
  );
  logger.info("🐰 Deploying TokenPortal contract...");
  const { address: tokenPortalAddress } = await deployL1Contract(
    walletClient,
    publicClient,
    TokenPortalAbi,
    TokenPortalBytecode
  );
  logger.info(`🐰 TokenPortal deployed at ${tokenPortalAddress.toString()}`);
  const tokenPortal = getContract({
    address: tokenPortalAddress.toString(),
    abi: TokenPortalAbi,
    client: walletClient,
  });

  const owner = wallet.getAddress();
  const token = await deployContract({
    contractLoggingName: "Token Contract",
    deployFn: (): DeploySentTx<TokenContract> => {
      return TokenContract.deploy(
        wallet,
        owner,
        TOKEN_NAME,
        TOKEN_SYMBOL,
        18
      ).send();
    },
  });

  const bridge = await deployContract({
    contractLoggingName: "Token Bridge Contract",
    deployFn: (): DeploySentTx<TokenBridgeContract> => {
      return TokenBridgeContract.deploy(wallet, token.address, tokenPortalAddress)
        .send();
    },
  });

  if ((await token.methods.get_admin().simulate()) !== owner.toBigInt())
    throw new Error(`Token admin is not ${owner.toString()}`);

  if (
    !((await bridge.methods.get_token().simulate()) as AztecAddress).equals(
      token.address
    )
  )
    throw new Error(`Bridge token is not ${token.address.toString()}`);

  await logAndWaitForTx(
    token.methods.set_minter(bridge.address, true).send(),
    "setting minter"
  );
  if ((await token.methods.is_minter(bridge.address).simulate()) === 1n)
    throw new Error(`Bridge is not a minter`);

  const { l1ContractAddresses } = await pxe.getNodeInfo();
  await tokenPortal.write.initialize(
    [
      l1ContractAddresses.registryAddress.toString(),
      underlyingERC20Address.toString(),
      bridge.address.toString(),
    ],
    {}
  );

  const l1TokenPortalManager = new L1TokenPortalManager(
    tokenPortalAddress,
    underlyingERC20Address,
    l1ContractAddresses.outboxAddress,
    publicClient,
    walletClient,
    createDebugLogger("TEST")
  );
  const l1TokenManager = l1TokenPortalManager.getTokenManager();
  const ownerAddress = wallet.getAddress();
  logger.info("🐰 Initialization complete");

  const l1TokenBalance = 1000000n;
  const bridgeAmount = 100n;

  const ethAccount = EthAddress.fromString(
    (await walletClient.getAddresses())[0]
  );

  const l2Token = token;
  const l2Bridge = bridge;
  logger.info("🐰 1. minting tokens on L1");
  await l1TokenManager.mint(l1TokenBalance, ethAccount.toString());

  logger.info("🐰 2. depositing tokens to the TokenPortal");
  const shouldMint = false;
  const claim = await l1TokenPortalManager.bridgeTokensPublic(
    ownerAddress,
    bridgeAmount,
    shouldMint
  );
  assert(
    (await l1TokenManager.getL1TokenBalance(ethAccount.toString())) ===
      l1TokenBalance - bridgeAmount
  );
  const msgHash = Fr.fromString(claim.messageHash);

  logger.info("waiting for the message to be available for consumption...");
  await retryUntil(
    async () => await aztecNode.isL1ToL2MessageSynced(msgHash),
    "message sync",
    10
  );

  await logAndWaitForTx(
    l2Token.methods.mint_to_public(ownerAddress, 0n).send(),
    "minting public tokens A"
  );
  await logAndWaitForTx(
    l2Token.methods.mint_to_public(ownerAddress, 0n).send(), // NOTE: copied from tutorial, perhaps typo?
    "minting public tokens B"
  );

  logger.info("checking message leaf index matches...");
  const maybeIndexAndPath = await aztecNode.getL1ToL2MessageMembershipWitness(
    "latest",
    msgHash
  );
  assert(maybeIndexAndPath !== undefined);
  assert(maybeIndexAndPath[0] === claim.messageLeafIndex);

  logger.info(
    "🐰 3. consuming L1 -> L2 message and minting public tokens on L2"
  );
  const { claimAmount, claimSecret, messageLeafIndex } = claim;
  await logAndWaitForTx(
    l2Bridge.methods
      .claim_public(ownerAddress, claimAmount, claimSecret, messageLeafIndex)
      .send(),
    "claiming public tokens"
  );

  const l2TokenBalance = (await l2Token.methods
    .balance_of_public(ownerAddress)
    .simulate()) as bigint;

  assert(l2TokenBalance === bridgeAmount);

  //const underlyingERC20 = getContract({
  //  address: underlyingERC20Address.toString(),
  //  abi: TestERC20Abi,
  //  client: walletClient,
  //});
};
