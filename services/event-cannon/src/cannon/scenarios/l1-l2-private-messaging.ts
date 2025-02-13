import {
  AztecAddress,
  DeploySentTx,
  EthAddress,
  Fr,
  L1TokenPortalManager,
  createLogger,
  retryUntil,
  waitForPXE,
} from "@aztec/aztec.js";
import { logger } from "../../logger.js";
import { getAztecNodeClient, getPxe } from "../pxe.js";
import {
  deployContract,
  getNewAccount,
  logAndWaitForTx,
  publicDeployAccounts,
  registerContractClassArtifact,
} from "./utils/index.js";
import { getContract } from "viem";
import { ETHEREUM_RPC_URL } from "../../environment.js";
import {
  RollupAbi,
  TestERC20Abi,
  TestERC20Bytecode,
  TokenPortalAbi,
  TokenPortalBytecode,
} from "@aztec/l1-artifacts";
import { createL1Clients, deployL1Contract } from "@aztec/ethereum";
import assert from "assert";
import { TokenContract } from "@aztec/noir-contracts.js/Token";
import * as tokenContractArtifactJson from "@aztec/noir-contracts.js/artifacts/token_contract-Token" assert { type: "json" };
import { TokenBridgeContract } from "@aztec/noir-contracts.js/TokenBridge";
import * as tokenBridgeContractArtifactJson from "@aztec/noir-contracts.js/artifacts/token_bridge_contract-TokenBridge" assert { type: "json" };

const MNEMONIC = "test test test test test test test test test test test junk";
const TOKEN_NAME = "TokenName";
const TOKEN_SYMBOL = "TokenSymbol";

export const run = async () => {
  logger.info("===== L1/L2 PRIVATE MESSAGING =====");
  const aztecNode = getAztecNodeClient();
  const pxe = getPxe();
  await waitForPXE(pxe);
  const randomGenWallets = await Promise.all([
    getNewAccount(pxe).then(({ wallet }) => wallet),
    getNewAccount(pxe).then(({ wallet }) => wallet),
    getNewAccount(pxe).then(({ wallet }) => wallet),
  ]);
  if (!randomGenWallets) throw new Error("No initial accounts");

  const wallet = await getNewAccount(pxe).then(({ wallet }) => wallet);

  logger.info("🐰 Deploying accounts...");
  await publicDeployAccounts(wallet, randomGenWallets, pxe);

  const { walletClient, publicClient } = createL1Clients(
    ETHEREUM_RPC_URL,
    MNEMONIC,
  );
  logger.info("🐰 Deploying contracts...");

  const underlyingERC20Address = await deployL1Contract(
    walletClient,
    publicClient,
    TestERC20Abi,
    TestERC20Bytecode,
    ["Test Token", "TEST", walletClient.account.address],
  ).then(({ address }) => address);
  logger.info(
    `🐰 Underlying ERC20 deployed at ${underlyingERC20Address.toString()}`,
  );

  logger.info("🐰 Deploying TokenPortal contract...");
  const { address: tokenPortalAddress } = await deployL1Contract(
    walletClient,
    publicClient,
    TokenPortalAbi,
    TokenPortalBytecode,
    [],
  );
  logger.info(`🐰 TokenPortal deployed at ${tokenPortalAddress.toString()}`);
  const tokenPortal = getContract({
    address: tokenPortalAddress.toString(),
    abi: TokenPortalAbi,
    client: walletClient,
  });

  const owner = wallet.getAddress();

  const tokenContractLoggingName = "Token Contract";
  const token = await deployContract({
    contractLoggingName: tokenContractLoggingName,
    deployFn: (): DeploySentTx<TokenContract> => {
      return TokenContract.deploy(
        wallet,
        owner,
        TOKEN_NAME,
        TOKEN_SYMBOL,
        18,
      ).send();
    },
    node: getAztecNodeClient(),
  });
  registerContractClassArtifact(
    tokenContractLoggingName,
    tokenContractArtifactJson,
    token.instance.contractClassId.toString(),
    token.instance.version,
  ).catch((err) => {
    logger.error(err);
  });

  const tokenBridgeContractLoggingName = "Token Bridge Contract";
  const bridge = await deployContract({
    contractLoggingName: tokenBridgeContractLoggingName,
    deployFn: (): DeploySentTx<TokenBridgeContract> => {
      return TokenBridgeContract.deploy(
        wallet,
        token.address,
        tokenPortalAddress,
      ).send();
    },
    node: getAztecNodeClient(),
  });

  registerContractClassArtifact(
    tokenBridgeContractLoggingName,
    tokenBridgeContractArtifactJson,
    bridge.instance.contractClassId.toString(),
    bridge.instance.version,
  ).catch((err) => {
    logger.error(err);
  });

  if ((await token.methods.get_admin().simulate()) !== owner.toBigInt())
    throw new Error(`Token admin is not ${owner.toString()}`);

  if (
    !(
      (await bridge.methods.get_config().simulate()) as { token: AztecAddress }
    ).token.equals(token.address)
  )
    throw new Error(`Bridge token is not ${token.address.toString()}`);

  await logAndWaitForTx(
    token.methods.set_minter(bridge.address, true).send(),
    "setting minter",
  );
  if ((await token.methods.is_minter(bridge.address).simulate()) === 1n)
    throw new Error(`Bridge is not a minter`);

  const { l1ContractAddresses } = await pxe.getNodeInfo();
  const rollup = getContract({
    address: l1ContractAddresses.rollupAddress.toString(),
    abi: RollupAbi,
    client: walletClient,
  });

  await tokenPortal.write.initialize(
    [
      l1ContractAddresses.registryAddress.toString(),
      underlyingERC20Address.toString(),
      bridge.address.toString(),
    ],
    {},
  );

  const l1TokenPortalManager = new L1TokenPortalManager(
    tokenPortalAddress,
    underlyingERC20Address,
    l1ContractAddresses.outboxAddress,
    publicClient,
    walletClient,
    createLogger("L1TokenPortalManager-private"),
  );
  const l1TokenManager = l1TokenPortalManager.getTokenManager();
  const ownerAddress = wallet.getAddress();
  logger.info("🐰 Initialization complete");

  const l1TokenBalance = 1000000n;
  const bridgeAmount = 100n;

  const ethAccount = EthAddress.fromString(
    (await walletClient.getAddresses())[0],
  );

  const l2Token = token;
  const l2Bridge = bridge;

  logger.info("🐰 1. minting tokens on L1");
  await l1TokenManager.mint(l1TokenBalance, ethAccount.toString());

  logger.info("🐰 2. depositing tokens to the TokenPortal privately");
  const shouldMint = false;
  const claim = await l1TokenPortalManager.bridgeTokensPrivate(
    ownerAddress,
    bridgeAmount,
    shouldMint,
  );
  assert(
    (await l1TokenManager.getL1TokenBalance(ethAccount.toString())) ===
      l1TokenBalance - bridgeAmount,
  );
  const msgHash = Fr.fromString(claim.messageHash);

  logger.info("waiting for the message to be available for consumption...");
  await retryUntil(
    async () => await aztecNode.isL1ToL2MessageSynced(msgHash),
    "message sync",
    10,
  );

  await logAndWaitForTx(
    l2Token.methods.mint_to_public(ownerAddress, 0n).send(),
    "minting public tokens A",
  );
  await logAndWaitForTx(
    l2Token.methods.mint_to_public(ownerAddress, 0n).send(),
    "minting public tokens B",
  );

  logger.info("checking message leaf index matches...");
  const maybeIndexAndPath = await aztecNode.getL1ToL2MessageMembershipWitness(
    "latest",
    msgHash,
  );
  assert(maybeIndexAndPath !== undefined);
  assert(maybeIndexAndPath[0] === claim.messageLeafIndex);

  logger.info(
    "🐰 3. consuming L1 -> L2 message and minting private tokens on L2",
  );
  const { claimAmount, claimSecret, messageLeafIndex } = claim;

  await logAndWaitForTx(
    l2Bridge.methods
      .claim_private(ownerAddress, claimAmount, claimSecret, messageLeafIndex)
      .send(),
    "claiming private tokens",
  );

  const l2TokenBalance = (await l2Token.methods
    .balance_of_private(ownerAddress)
    .simulate()) as bigint;
  assert(l2TokenBalance === bridgeAmount);

  logger.info("🐰 4. withdrawing funds from L2");
  const withdrawAmount = 9n;
  const nonce = Fr.random();

  const user1Wallet = wallet;
  await user1Wallet.createAuthWit({
    caller: l2Bridge.address,
    action: l2Token.methods.burn_private(ownerAddress, withdrawAmount, nonce),
  });

  logger.info("🐰 5. withdrawing owner funds from L2 to L1");
  const l2ToL1Message = l1TokenPortalManager.getL2ToL1MessageLeaf(
    withdrawAmount,
    ethAccount,
    l2Bridge.address,
    EthAddress.ZERO,
  );
  const l2TxReceipt = await logAndWaitForTx(
    l2Bridge.methods
      .exit_to_l1_private(
        l2Token.address,
        ethAccount,
        withdrawAmount,
        EthAddress.ZERO,
        nonce,
      )
      .send(),
    "exiting to L1",
  );

  assert(
    (await l2Token.methods.balance_of_private(ownerAddress).simulate()) ===
      bridgeAmount - withdrawAmount,
  );

  assert(
    (await l1TokenManager.getL1TokenBalance(ethAccount.toString())) ===
      l1TokenBalance - bridgeAmount,
  );

  const [l2ToL1MessageIndex, siblingPath] =
    await aztecNode.getL2ToL1MessageMembershipWitness(
      l2TxReceipt!.blockNumber!,
      l2ToL1Message,
    );

  await rollup.write.setAssumeProvenThroughBlockNumber([
    await rollup.read.getPendingBlockNumber(),
  ]);

  await l1TokenPortalManager.withdrawFunds(
    withdrawAmount,
    ethAccount,
    BigInt(l2TxReceipt!.blockNumber!),
    l2ToL1MessageIndex,
    siblingPath,
  );

  assert(
    (await l1TokenManager.getL1TokenBalance(ethAccount.toString())) ===
      l1TokenBalance - bridgeAmount + withdrawAmount,
  );
};
