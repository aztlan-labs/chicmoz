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
  generateVerifyInstancePayload,
  generateVerifyInstanceUrl,
} from "@chicmoz-pkg/contract-verification";
import { NODE_ENV, NodeEnv } from "@chicmoz-pkg/types";
import http from "http";
import https from "https";
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
  const receipt = await tx.wait();
  logger.info(
    `⛏  TX ${hash} (${additionalInfo}) block ${receipt.blockNumber}`
  );
  return receipt;
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
  accountName,
}: {
  pxe: PXE;
  secretKey: Fr;
  salt: Fr;
  accountName?: string;
}) => {
  logger.info(`  Creating new Schnorr account... (${accountName})`);
  const schnorrAccount = await getSchnorrAccount(
    pxe,
    secretKey,
    deriveSigningKey(secretKey),
    salt
  );
  logger.info(
    `    Schnorr account created ${schnorrAccount
      .getAddress()
      .toString()} (${accountName})`
  );
  const { address } = await schnorrAccount.getCompleteAddress();
  logger.info(`    Deploying Schnorr account to network... (${accountName})`);
  await logAndWaitForTx(
    schnorrAccount.deploy(),
    `Deploying account ${accountName}`
  );
  logger.info(`    Getting Schnorr account wallet... (${accountName})`);
  const wallet = await schnorrAccount.getWallet();
  logger.info(
    `    🔐 Schnorr account created at: ${address.toString()} (${accountName})`
  );
  return { schnorrAccount, wallet, address };
};

export const getNewAccount = async (pxe: PXE, accountName?: string) => {
  const secretKey = Fr.random();
  const salt = Fr.random();
  return getNewSchnorrAccount({
    pxe,
    secretKey,
    salt,
    accountName,
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
        ContractClassRegisteredEvent.isContractClassRegisteredEvent(log.data)
      )
      .map((log) => ContractClassRegisteredEvent.fromLog(log.data))
      .map((e) => e.toContractClassPublic())
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
    `⛏  ${contractLoggingName} instance deployed at: ${addressString} block: ${receipt.blockNumber} ${classIdString}`
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
        fn.parameters
      );
      await logAndWaitForTx(
        (
          await broadcastPrivateFunction(wallet, contract.artifact, selector)
        ).send(),
        `Broadcasting private function ${fn.name}`
      );
    }
    if (fn.functionType === FunctionType.UNCONSTRAINED) {
      const selector = await FunctionSelector.fromNameAndParameters(
        fn.name,
        fn.parameters
      );
      await logAndWaitForTx(
        (
          await broadcastUnconstrainedFunction(
            wallet,
            contract.artifact,
            selector
          )
        ).send(),
        `Broadcasting unconstrained function ${fn.name}`
      );
    }
  }
};

export const publicDeployAccounts = async (
  sender: Wallet,
  accountsToDeploy: Wallet[],
  pxe: PXE
) => {
  const notPubliclyDeployedAccounts = await Promise.all(
    accountsToDeploy.map(async (a) => {
      const address = a.getAddress();
      const contractMetadata = await pxe.getContractMetadata(address);
      return contractMetadata;
    })
  ).then((results) =>
    results.filter((result) => !result.isContractPubliclyDeployed)
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
              `🚨 Contract instance not found for contract isIntialized: ${contractMetadata.isContractInitialized}`
            );
            return undefined;
          }
          return (
            await deployInstance(sender, contractMetadata.contractInstance)
          ).request();
        })
      )
    ).filter((call) => call !== undefined) as FunctionCall[]),
  ];
  const batch = new BatchCall(sender, deployCalls);
  await batch.send().wait();
};

export const registerContractClassArtifact = async (
  contractLoggingName: string,
  artifactObj: { default: NoirCompiledContract } | NoirCompiledContract,
  contractClassId: string,
  version: number,
  skipSleep = false
) => {
  if (NODE_ENV === NodeEnv.PROD) {
    logger.info(`Sleeping for 10 seconds before registering contract class`);
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
  const url = new URL(
    generateVerifyArtifactUrl(EXPLORER_API_URL, contractClassId, version)
  );
  const postData = JSON.stringify(generateVerifyArtifactPayload(artifactObj));

  const sizeInMB = Buffer.byteLength(postData) / 1000 ** 2;
  if (sizeInMB > 10) {
    logger.warn(
      `🚨📜 ${contractLoggingName} Artifact is too large to register in explorer-api: ${url.href} (byte length: ${sizeInMB} MB)`
    );
    return;
  }
  logger.info(
    `📜 ${contractLoggingName} Trying to register artifact in explorer-api: ${url.href} (byte length: ${sizeInMB} MB)`
  );
  if (!skipSleep) await new Promise((resolve) => setTimeout(resolve, 1000));

  const request = url.protocol === "https:" ? https.request : http.request;

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
      }
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
        }
      )}`
    );
  } else {
    logger.error(
      `📜🚨 ${contractLoggingName} Artifact registration failed. ${JSON.stringify(
        {
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          data: res.data,
        }
      )}`
    );
  }
};

export const registerContractInstance = async (
  contractLoggingName: string,
  artifactObj: { default: NoirCompiledContract } | NoirCompiledContract,
  contractInstanceAddress: string,
  publicKeysString: string,
  deployer: string,
  salt: string,
  args: string[],
  skipSleep = false
) => {
  const url = new URL(
    generateVerifyInstanceUrl(EXPLORER_API_URL, contractInstanceAddress)
  );

  const postData = JSON.stringify(
    generateVerifyInstancePayload({
      publicKeysString,
      deployer,
      salt,
      constructorArgs: args,
      artifactObj,
    })
  );
  // TODO: unified explorer-calls
  const sizeInMB = Buffer.byteLength(postData) / 1000 ** 2;
  if (sizeInMB > 10) {
    logger.warn(
      `🚨📜 ${contractLoggingName} Artifact is too large to register in explorer-api: ${url.href} (byte length: ${sizeInMB} MB)`
    );
    return;
  }
  logger.info(
    `📜 ${contractLoggingName} Trying to register artifact in explorer-api: ${url.href} (byte length: ${sizeInMB} MB)`
  );
  if (!skipSleep) await new Promise((resolve) => setTimeout(resolve, 1000));

  const request = url.protocol === "https:" ? https.request : http.request;

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
      }
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
        }
      )}`
    );
  } else {
    logger.error(
      `📜🚨 ${contractLoggingName} Artifact registration failed. ${JSON.stringify(
        {
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          data: res.data,
        }
      )}`
    );
  }
};

