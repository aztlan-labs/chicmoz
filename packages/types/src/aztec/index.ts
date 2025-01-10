import { type NodeInfo } from "@aztec/aztec.js";
import { EthAddress, ethAddressSchema } from "../general.js";
export { type NodeInfo };

export * from "./l2Block.js";
export * from "./l2Contract.js";
export * from "./l2TxEffect.js";
export * from "./fee-recipient.js";
export * from "./special.js";
export { frNumberSchema } from "./utils.js";

export const transformNodeInfo = (nodeInfo: NodeInfo): StringifiedNodeInfo => {
  const l1ContractAddresses = Object.entries(
    nodeInfo.l1ContractAddresses
  ).reduce(
    (acc, [k, v]) => {
      acc[k] = ethAddressSchema.parse(v.toString());
      return acc;
    },
    {} as Record<string, EthAddress>
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

export type StringifiedNodeInfo = Omit<
  NodeInfo,
  "l1ContractAddresses" | "protocolContractAddresses"
> & {
  l1ContractAddresses: Record<
    keyof NodeInfo["l1ContractAddresses"],
    EthAddress
  >;
  protocolContractAddresses: Record<
    keyof NodeInfo["protocolContractAddresses"],
    string
  >;
};
