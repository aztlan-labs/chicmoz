import { type NodeInfo } from "@aztec/aztec.js";
import { ProtocolContractAddressesSchema } from "@aztec/circuits.js";
import { L1ContractAddressesSchema } from "@aztec/ethereum";
import { z } from "zod";
import { L2NetworkId, l2NetworkIdSchema } from "../network-ids.js";

export const chicmozChainInfoSchema = z.object({
  L2NetworkId: l2NetworkIdSchema,
  l1ChainId: z.number(),
  protocolVersion: z.string(),
  l1ContractAddresses: L1ContractAddressesSchema,
  protocolContractAddresses: ProtocolContractAddressesSchema,
});

export type ChicmozChainInfo = z.infer<typeof chicmozChainInfoSchema>;

export const getChicmozChainInfo = (
  L2NetworkId: L2NetworkId,
  nodeInfo: NodeInfo
): ChicmozChainInfo => {
  return {
    L2NetworkId,
    l1ChainId: nodeInfo.l1ChainId,
    protocolVersion: nodeInfo.protocolVersion.toString(),
    l1ContractAddresses: nodeInfo.l1ContractAddresses,
    protocolContractAddresses: nodeInfo.protocolContractAddresses,
  };
};
