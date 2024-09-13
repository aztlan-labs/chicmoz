export * from "./l2Block.js";

// TODO: the import should work, but instead we're using a type alias
// import { type NodeInfo } from "@aztec/aztec.js";
export type NodeInfoAlias = {
  nodeVersion: string;
  l1ChainId: number;
  protocolVersion: number;
  enr: string | undefined;
  l1ContractAddresses: object;
  protocolContractAddresses: object;
};

