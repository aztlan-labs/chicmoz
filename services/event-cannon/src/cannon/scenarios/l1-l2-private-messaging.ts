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
import {
  deployContract,
  logAndWaitForTx,
  publicDeployAccounts,
} from "./utils/index.js";
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
  RollupAbi,
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
  logger.info("===== L1/L2 PRIVATE MESSAGING =====");
  const aztecNode = getAztecNodeClient();
  const pxe = getPxe();
  await waitForPXE(pxe);
  const namedWallets = getWallets();

  const wallets = [namedWallets.alice, namedWallets.bob, namedWallets.charlie];
  const wallet = namedWallets.alice;
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

  // Deploy underlying ERC20
  const underlyingERC20Address = await deployL1Contract(
    walletClient,
    publicClient,
    TestERC20Abi,
    TestERC20Bytecode
  ).then(({ address }) => address);
  logger.info(
    `🐰 Underlying ERC20 deployed at ${underlyingERC20Address.toString()}`
  );

  // Deploy Token Portal
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

  // Deploy L2 Token
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

  // Deploy L2 Bridge
  const bridge = await deployContract({
    contractLoggingName: "Token Bridge Contract",
    deployFn: (): DeploySentTx<TokenBridgeContract> => {
      return TokenBridgeContract.deploy(
        wallet,
        token.address,
        tokenPortalAddress
      ).send();
    },
  });

  // Validate token and bridge setup
  if ((await token.methods.get_admin().simulate()) !== owner.toBigInt())
    throw new Error(`Token admin is not ${owner.toString()}`);

  if (
    !((await bridge.methods.get_token().simulate()) as AztecAddress).equals(
      token.address
    )
  )
    throw new Error(`Bridge token is not ${token.address.toString()}`);

  // Set bridge as minter
  await logAndWaitForTx(
    token.methods.set_minter(bridge.address, true).send(),
    "setting minter"
  );
  if ((await token.methods.is_minter(bridge.address).simulate()) === 1n)
    throw new Error(`Bridge is not a minter`);

  // Get L1 contract addresses
  const { l1ContractAddresses } = await pxe.getNodeInfo();
  const rollup = getContract({
    address: l1ContractAddresses.rollupAddress.toString(),
    abi: RollupAbi,
    client: walletClient,
  });

  // Initialize token portal
  await tokenPortal.write.initialize(
    [
      l1ContractAddresses.registryAddress.toString(),
      underlyingERC20Address.toString(),
      bridge.address.toString(),
    ],
    {}
  );

  // Setup token portal manager
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

  // Prepare for cross-chain messaging
  const l1TokenBalance = 1000000n;
  const bridgeAmount = 100n;

  const ethAccount = EthAddress.fromString(
    (await walletClient.getAddresses())[0]
  );

  const l2Token = token;
  const l2Bridge = bridge;

  // 1. Mint tokens on L1
  logger.info("🐰 1. minting tokens on L1");
  await l1TokenManager.mint(l1TokenBalance, ethAccount.toString());

  // 2. Deposit tokens to the TokenPortal privately
  logger.info("🐰 2. depositing tokens to the TokenPortal privately");
  const shouldMint = false;
  const claim = await l1TokenPortalManager.bridgeTokensPrivate(
    ownerAddress,
    bridgeAmount,
    shouldMint
  );
  assert(
    (await l1TokenManager.getL1TokenBalance(ethAccount.toString())) ===
      l1TokenBalance - bridgeAmount
  );
  const msgHash = Fr.fromString(claim.messageHash);

  // 3. Wait for message to be available
  logger.info("waiting for the message to be available for consumption...");
  await retryUntil(
    async () => await aztecNode.isL1ToL2MessageSynced(msgHash),
    "message sync",
    10
  );

  // 4. Make message consumable (by progressing the rollup)
  await logAndWaitForTx(
    l2Token.methods.mint_to_public(ownerAddress, 0n).send(),
    "minting public tokens A"
  );
  await logAndWaitForTx(
    l2Token.methods.mint_to_public(ownerAddress, 0n).send(),
    "minting public tokens B"
  );

  // 5. Verify message leaf index
  logger.info("checking message leaf index matches...");
  const maybeIndexAndPath = await aztecNode.getL1ToL2MessageMembershipWitness(
    "latest",
    msgHash
  );
  assert(maybeIndexAndPath !== undefined);
  assert(maybeIndexAndPath[0] === claim.messageLeafIndex);

  // 6. Consume L1 -> L2 message and mint private tokens
  logger.info(
    "🐰 3. consuming L1 -> L2 message and minting private tokens on L2"
  );
  const { claimAmount, claimSecret, messageLeafIndex } = claim;
  await logAndWaitForTx(
    l2Bridge.methods
      .claim_private(ownerAddress, claimAmount, claimSecret, messageLeafIndex)
      .send(),
    "claiming private tokens"
  );

  // 7. Verify private token balance
  const l2TokenBalance = (await l2Token.methods
    .balance_of_private(ownerAddress)
    .simulate()) as bigint;
  assert(l2TokenBalance === bridgeAmount);

  // 8. Withdraw funds from L2
  logger.info("🐰 4. withdrawing funds from L2");
  const withdrawAmount = 9n;
  const nonce = Fr.random();

  // Create auth wit for burning private tokens
  const user1Wallet = wallet;
  await user1Wallet.createAuthWit({
    caller: l2Bridge.address,
    action: l2Token.methods.burn_private(ownerAddress, withdrawAmount, nonce),
  });

  // 9. Withdraw owner funds from L2 to L1
  logger.info("🐰 5. withdrawing owner funds from L2 to L1");
  const l2ToL1Message = l1TokenPortalManager.getL2ToL1MessageLeaf(
    withdrawAmount,
    ethAccount,
    l2Bridge.address,
    EthAddress.ZERO
  );
  const l2TxReceipt = await logAndWaitForTx(
    l2Bridge.methods
      .exit_to_l1_private(
        l2Token.address,
        ethAccount,
        withdrawAmount,
        EthAddress.ZERO,
        nonce
      )
      .send(),
    "exiting to L1"
  );

  // Verify balances
  assert(
    (await l2Token.methods.balance_of_private(ownerAddress).simulate()) ===
      bridgeAmount - withdrawAmount
  );
  assert(
    (await l1TokenManager.getL1TokenBalance(ethAccount.toString())) ===
      l1TokenBalance - bridgeAmount
  );

  // 10. Get message witness and withdraw funds
  const [l2ToL1MessageIndex, siblingPath] =
    await aztecNode.getL2ToL1MessageMembershipWitness(
      l2TxReceipt.blockNumber!,
      l2ToL1Message
    );

  // Assume block is proven (temporary solution)
  await rollup.write.setAssumeProvenThroughBlockNumber([
    await rollup.read.getPendingBlockNumber(),
  ]);

  // Withdraw funds from L1 bridge
  await l1TokenPortalManager.withdrawFunds(
    withdrawAmount,
    ethAccount,
    BigInt(l2TxReceipt.blockNumber!),
    l2ToL1MessageIndex,
    siblingPath
  );

  // Final balance check
  assert(
    (await l1TokenManager.getL1TokenBalance(ethAccount.toString())) ===
      l1TokenBalance - bridgeAmount + withdrawAmount
  );

  logger.info("🐰🐰🐰🐰🐰🐰🐰🐰🐰🐰🐰🐰🐰🐰🐰");
};
