import {
  SchnorrAccountContractArtifact,
  getSchnorrAccount,
} from "@aztec/accounts/schnorr";
import {
  AztecNode,
  BatchCall,
  Contract,
  DeploySentTx,
  Fr,
  FunctionCall,
  FunctionSelector,
  NoirCompiledContract,
  PXE,
  SentTx,
  Wallet,
} from "@aztec/aztec.js";
import {
  broadcastPrivateFunction,
  broadcastUnconstrainedFunction,
  deployInstance,
  registerContractClass,
} from "@aztec/aztec.js/deployment";
import { deriveSigningKey } from "@aztec/circuits.js";
import { FunctionType } from "@aztec/foundation/abi";
import { ContractClassRegisteredEvent } from "@aztec/protocol-contracts/class-registerer";
import {
  generateVerifyArtifactPayload,
  generateVerifyArtifactUrl,
} from "@chicmoz-pkg/contract-verification";
import { request } from "http";
import { EXPLORER_API_URL } from "../../../environment.js";
import { logger } from "../../../logger.js";

export const truncateHashString = (value: string) => {
  const startHash = value.substring(0, 6);
  const endHash = value.substring(value.length - 4, value.length);
  return `${startHash}...${endHash}`;
};

export const logAndWaitForTx = async (tx: SentTx, additionalInfo: string) => {
  const hash = (await tx.getTxHash()).toString();
  logger.info(`📫 TX ${hash} (${additionalInfo})`);
  try {
    const receipt = await tx.wait();
    logger.info(
      `⛏  TX ${hash} (${additionalInfo}) block ${receipt.blockNumber}`,
    );
    return receipt;
  } catch (err) {
    logger.error(err);
  }
};

export const getFunctionSpacer = (type: FunctionType) => {
  if (type === FunctionType.PRIVATE) return type + "       ";
  if (type === FunctionType.UNCONSTRAINED) return type + " ";
  return type + "        ";
};

export const getNewSchnorrAccount = async ({
  pxe,
  secretKey,
  salt,
}: {
  pxe: PXE;
  secretKey: Fr;
  salt: Fr;
}) => {
  logger.info("  Creating new Schnorr account...");
  const schnorrAccount = await getSchnorrAccount(
    pxe,
    secretKey,
    deriveSigningKey(secretKey),
    salt,
  );
  logger.info(
    `    Schnorr account created ${schnorrAccount.getAddress().toString()}`,
  );
  const { address } = await schnorrAccount.getCompleteAddress();
  logger.info("    Deploying Schnorr account to network...");
  await logAndWaitForTx(schnorrAccount.deploy(), "Deploying account");
  logger.info("    Getting Schnorr account wallet...");
  const wallet = await schnorrAccount.getWallet();
  logger.info(`    🔐 Schnorr account created at: ${address.toString()}`);
  return { schnorrAccount, wallet, address };
};

export const getNewAccount = async (pxe: PXE) => {
  const secretKey = Fr.random();
  const salt = Fr.random();
  return getNewSchnorrAccount({
    pxe,
    secretKey,
    salt,
  });
};

const getNewContractClassId = async (node: AztecNode, blockNumber?: number) => {
  if (!blockNumber) return undefined;
  const block = await node.getBlock(blockNumber);
  if (!block) throw new Error(`Block ${blockNumber} not found`);
  const contractClassLogs = block.body.txEffects
    .flatMap((txEffect) => (txEffect ? [txEffect.contractClassLogs] : []))
    .flatMap((txLog) => txLog.unrollLogs());

  const contractClasses = await Promise.all(
    contractClassLogs
      .filter((log) =>
        ContractClassRegisteredEvent.isContractClassRegisteredEvent(log.data),
      )
      .map((log) => ContractClassRegisteredEvent.fromLog(log.data))
      .map((e) => e.toContractClassPublic()),
  );

  return contractClasses[0]?.id.toString();
};

export const deployContract = async <T extends Contract>({
  contractLoggingName,
  deployFn,
  broadcastWithWallet,
  node,
}: {
  contractLoggingName: string;
  deployFn: () => DeploySentTx<T>;
  broadcastWithWallet?: Wallet;
  node: AztecNode;
}): Promise<T> => {
  logger.info(`DEPLOYING ${contractLoggingName}`);
  const contractTx = deployFn();
  const hash = (await contractTx.getTxHash()).toString();
  logger.info(`📫 ${contractLoggingName} txHash: ${hash} (Deploying contract)`);
  const deployedContract = await contractTx.deployed();
  const receipt = await contractTx.wait();
  const addressString = deployedContract.address.toString();
  const newClassId = await getNewContractClassId(node, receipt.blockNumber);
  const classIdString = newClassId
    ? `(🍏 also, a new contract class was added: ${newClassId})`
    : `(🍎 attached classId: ${deployedContract.instance.contractClassId.toString()})`;
  logger.info(
    `⛏  ${contractLoggingName} instance deployed at: ${addressString} block: ${receipt.blockNumber} ${classIdString}`,
  );
  if (broadcastWithWallet) {
    await broadcastFunctions({
      wallet: broadcastWithWallet,
      contract: deployedContract,
    });
  }
  return deployedContract;
};

export const broadcastFunctions = async ({
  wallet,
  contract,
}: {
  wallet: Wallet;
  contract: Contract;
}) => {
  logger.info("BROADCASTING FUNCTIONS");
  for (const fn of contract.artifact.functions) {
    logger.info(`${getFunctionSpacer(fn.functionType)}${fn.name}`);
    if (fn.functionType === FunctionType.PRIVATE) {
      const selector = await FunctionSelector.fromNameAndParameters(
        fn.name,
        fn.parameters,
      );
      await logAndWaitForTx(
        (
          await broadcastPrivateFunction(wallet, contract.artifact, selector)
        ).send(),
        `Broadcasting private function ${fn.name}`,
      );
    }
    if (fn.functionType === FunctionType.UNCONSTRAINED) {
      const selector = await FunctionSelector.fromNameAndParameters(
        fn.name,
        fn.parameters,
      );
      await logAndWaitForTx(
        (
          await broadcastUnconstrainedFunction(
            wallet,
            contract.artifact,
            selector,
          )
        ).send(),
        `Broadcasting unconstrained function ${fn.name}`,
      );
    }
  }
};

export const publicDeployAccounts = async (
  sender: Wallet,
  accountsToDeploy: Wallet[],
  pxe: PXE,
) => {
  const notPubliclyDeployedAccounts = await Promise.all(
    accountsToDeploy.map(async (a) => {
      const address = a.getAddress();
      const contractMetadata = await pxe.getContractMetadata(address);
      return contractMetadata;
    }),
  ).then((results) =>
    results.filter((result) => !result.isContractPubliclyDeployed),
  );
  if (notPubliclyDeployedAccounts.length === 0) return;
  const deployCalls: FunctionCall[] = [
    await (
      await registerContractClass(sender, SchnorrAccountContractArtifact)
    ).request(),
    ...((
      await Promise.all(
        notPubliclyDeployedAccounts.map(async (contractMetadata) => {
          if (!contractMetadata.contractInstance) {
            logger.warn(
              `🚨 Contract instance not found for contract isIntialized: ${contractMetadata.isContractInitialized}`,
            );
            return undefined;
          }
          return (
            await deployInstance(sender, contractMetadata.contractInstance)
          ).request();
        }),
      )
    ).filter((call) => call !== undefined) as FunctionCall[]),
  ];

  /*BUG:
  [15:46:44.860] ERROR: world-state:database Call BATCH_INSERT failed: Error: Unable to insert values into tree NullifierTree leaf type NullifierLeafValue is not updateable and 0x27b6a0fa0d19417c4c820c9328f9cbfc724d18272d005c7144647888ff2a1b2a is already present: [Error: Unable to insert values into tree NullifierTree leaf type NullifierLeafValue is not updateable and 0x27b6a0fa0d19417c4c820c9328f9cbfc724d18272d005c7144647888ff2a1b2a is already present] {"treeId":"NULLIFIER_TREE","forkId":1571,"leavesCount":64}
  - BatchCall failed with error above it does not matter that the addresses are random genererated. the error still persists
  */
  const batch = new BatchCall(sender, deployCalls);
  await batch.send().wait();
};

export const registerContractClassArtifact = async (
  contractLoggingName: string,
  artifactObj: { default: NoirCompiledContract } | NoirCompiledContract,
  contractClassId: string,
  version: number,
  skipSleep = false,
) => {
  const url = new URL(
    generateVerifyArtifactUrl(EXPLORER_API_URL, contractClassId, version),
  );
  const postData = JSON.stringify(generateVerifyArtifactPayload(artifactObj));

  const sizeInMB = Buffer.byteLength(postData) / 1000 ** 2;
  if (sizeInMB > 10) {
    logger.warn(
      `🚨📜 ${contractLoggingName} Artifact is too large to register in explorer-api: ${url.href} (byte length: ${sizeInMB} MB)`,
    );
    return;
  }
  logger.info(
    `📜 ${contractLoggingName} Trying to register artifact in explorer-api: ${url.href} (byte length: ${sizeInMB} MB)`,
  );
  if (!skipSleep) await new Promise((resolve) => setTimeout(resolve, 1000));

  const res: {
    statusCode: number | undefined;
    statusMessage: string | undefined;
    data: string;
  } = await new Promise((resolve, reject) => {
    const req = request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            data,
          });
        });
        // get the status code
      },
    );
    req.on("error", (error) => {
      logger.error(`🚨📜 ${contractLoggingName} Artifact registration failed.`);
      reject(error);
    });

    // Set a timeout (e.g., 5 seconds)
    req.setTimeout(5000, () => {
      reject(new Error("Request timed out"));
    });

    req.write(postData);
    req.end(); // This actually sends the request
  });
  if (res.statusCode === 200 || res.statusCode === 201) {
    logger.info(
      `📜✅ ${contractLoggingName} Artifact registered in explorer-api. ${JSON.stringify(
        {
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
        },
      )}`,
    );
  } else {
    logger.error(
      `📜🚨 ${contractLoggingName} Artifact registration failed. ${JSON.stringify(
        {
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          data: res.data,
        },
      )}`,
    );
  }
};
