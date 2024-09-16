/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  PXE,
  createPXEClient,
  type UnencryptedL2Log,
} from "@aztec/aztec.js";
import { ContractInstanceDeployedEvent } from "@aztec/circuits.js";
import { AZTEC_RPC } from "../constants.js";
import { logger } from "../logger.js";

let aztecNode: PXE;

const node = () => {
  if (!aztecNode) throw new Error("Node not initialized");
  return aztecNode;
};

export const init = async () => {
  aztecNode = createPXEClient(AZTEC_RPC);
  logger.info("UUUUUUUGGGGLLLLY!!!!");
  const ninf = await aztecNode.getNodeInfo();
  logger.info(JSON.stringify(ninf));
  //await uglyFilipHack();
  await uglyFilipHack2();
  logger.info("UUUUUUUGGGGLLLLY!!!! END");
  return aztecNode.getNodeInfo();
};

//export const getNodeInfo = async () => {
//  const n = node();
//  const [
//    nodeVersion,
//    protocolVersion,
//    chainId,
//    enr,
//    contractAddresses,
//    protocolContractAddresses,
//  ] = await Promise.all([
//    n.getNodeVersion(),
//    n.getVersion(),
//    n.getChainId(),
//    n.getEncodedEnr(),
//    n.getL1ContractAddresses(),
//    n.getProtocolContractAddresses(),
//  ]);
//
//  const nodeInfo: NodeInfo = {
//    nodeVersion,
//    l1ChainId: chainId,
//    protocolVersion,
//    enr,
//    l1ContractAddresses: contractAddresses,
//    protocolContractAddresses: protocolContractAddresses,
//  };
//
//  return nodeInfo;
//};

export const getBlock = async (height: number) => node().getBlock(height);

export const getBlocks = async (fromHeight: number, toHeight: number) => {
  const blocks = [];
  for (let i = fromHeight; i < toHeight; i++) {
    const block = await node().getBlock(i);
    blocks.push(block);
  }
  return blocks;
};

export const getLatestHeight = () => node().getBlockNumber();

const uglyFilipHack2 = async () => {
  const height = await getLatestHeight();
  let b = await getBlock(height);
  for (let h = 0; h < height; h++) {
    if (h % 100 === 0) logger.info(`Processing block ${h}`);
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (!b) return undefined;
    const deployedEvent = ContractInstanceDeployedEvent.fromLogs(
      b?.body.unencryptedLogs.txLogs as unknown as UnencryptedL2Log[]
    );
    logger.info(deployedEvent);
    if (deployedEvent.length > 0) 
      deployedEvent.forEach((c) => logger.info(c.address.toString()));
    
    b = await getBlock(h);
  }
  return b;
};

//type ContractArtifactWithClassId = ContractArtifact & { classId: Fr };
//const uglyFilipHack = async () => {
//  const knownContractAddresses = await aztecNode.getContracts();
//  const knownContracts = await Promise.all(
//    knownContractAddresses.map((contract) =>
//      aztecNode.getContractInstance(contract)
//    )
//  );
//  const classIds = [
//    ...new Set(knownContracts.map((contract) => contract?.contractClassId)),
//  ];
//  const knownArtifacts = await Promise.all(
//    classIds.map((classId) =>
//      classId
//        ? aztecNode
//            .getContractArtifact(classId)
//            .then((a) => (a ? { ...a, classId } : undefined))
//        : undefined
//    )
//  );
//  const map: Record<string, ContractArtifactWithClassId> = {};
//  for (const instance of knownContracts) {
//    if (instance) {
//      const artifact = knownArtifacts.find(
//        (a) => a?.classId.equals(instance.contractClassId)
//      );
//      if (artifact) {
//        map[instance.address.toString()] = artifact;
//      }
//    }
//  }
//  knownArtifacts.forEach((artifact) => {
//    logger.info(Object.keys(artifact));
//  });
//  logger.info(knownArtifacts.length);
//  //logger.info(JSON.stringify(map));
//};
