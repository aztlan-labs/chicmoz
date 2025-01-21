import { type NodeInfo as AztecNodeInfo } from "@aztec/aztec.js";
import { z } from "zod";
import { L2NetworkId, l2NetworkIdSchema } from "./network-ids.js";

export const chicmozNodeInfoSchema = z.object({
  rpcUrl: z.string(),
  id: z.string().optional(),
  createdAt: z.date(),
});

export const chicmozSequencerInfoSchema = z.object({
  enr: z.string(),
  nodeId: z.string(),
  l2NetworkId: l2NetworkIdSchema,
  protocolVersion: z.number(),
  nodeVersion: z.string(),
  l1ChainId: z.number(),
  lastSeenAt: z.date(),
  createdAt: z.date(),
});

export const chicmozNodeErrorSchema = z.object({
  message: z.string(),
  nodeId: z.string(),
  stack: z.string(),
  data: z.string(),
  createdAt: z.date().default(() => new Date()),
});

export type ChicmozSequencerInfo = z.infer<typeof chicmozSequencerInfoSchema>;
export type ChicmozNodeInfo = z.infer<typeof chicmozNodeInfoSchema>;
export type ChicmozNodeError = z.infer<typeof chicmozNodeErrorSchema>;

export const getSequencerInfo = (
  l2NetworkId: L2NetworkId,
  nodeInfo: AztecNodeInfo,
  enr: string,
  nodeId: string,
  lastSeenAt: Date,
  createdAt: Date
): ChicmozSequencerInfo => {
  return {
    enr,
    nodeId,
    l2NetworkId,
    protocolVersion: nodeInfo.protocolVersion,
    nodeVersion: nodeInfo.nodeVersion,
    l1ChainId: nodeInfo.l1ChainId,
    lastSeenAt,
    createdAt,
  };
};
