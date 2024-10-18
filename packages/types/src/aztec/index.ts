import { type NodeInfo } from "@aztec/aztec.js";
export { type NodeInfo };

export * from "./l2Block.js";
export * from "./l2Contract.js";
export * from "./l2TxEffect.js";
export * from "./deluxe.js";
export { frNumberSchema } from "./utils.js";

export const transformNodeInfo = (nodeInfo: NodeInfo): StringifiedNodeInfo => {
  const l1ContractAddresses = Object.entries(
    nodeInfo.l1ContractAddresses
  ).reduce(
    (acc, [k, v]) => {
      acc[k] = v.toString();
      return acc;
    },
    {} as Record<string, string>
  );

  const protocolContractAddresses = Object.entries(
    nodeInfo.protocolContractAddresses
  ).reduce(
    (acc, [k, v]) => {
      acc[k] = v.toString();
      return acc;
    },
    {} as Record<string, string>
  );
  const nodeInfoWithStringifiedAddresses = {
    ...nodeInfo,
    l1ContractAddresses,
    protocolContractAddresses,
  };
  return nodeInfoWithStringifiedAddresses;
};

export type StringifiedNodeInfo = Omit<NodeInfo, "l1ContractAddresses" | "protocolContractAddresses"> & {
  l1ContractAddresses: Record<keyof NodeInfo["l1ContractAddresses"], string>;
  protocolContractAddresses: Record<keyof NodeInfo["protocolContractAddresses"], string>;
};
