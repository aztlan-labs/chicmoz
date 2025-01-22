import { L2Block, Tx } from "@aztec/aztec.js";
import { PendingTxsEvent } from "@chicmoz-pkg/message-registry";
import {
  ChicmozChainInfo,
  ChicmozL2RpcNode,
  ChicmozL2RpcNodeError,
  ChicmozL2SequencerInfo,
  chicmozL2RpcNodeErrorSchema,
} from "@chicmoz-pkg/types";
import { logger } from "../../logger.js";
import {
  publishMessage,
  publishMessageSync,
} from "../../svcs/message-bus/index.js";

export const onBlock = async (block: L2Block) => {
  const height = Number(block.header.globalVariables.blockNumber);
  logger.info(`🦊 publishing block ${height}...`);
  const blockStr = block.toString();
  await publishMessage("NEW_BLOCK_EVENT", {
    block: blockStr,
    blockNumber: height,
  });
};

export const onCatchupBlock = async (block: L2Block) => {
  const blockStr = block.toString();
  await publishMessage("CATCHUP_BLOCK_EVENT", {
    block: blockStr,
    blockNumber: Number(block.header.globalVariables.blockNumber),
  });
};
// TODO: onCatchupRequestFromExplorerApi

export const onPendingTxs = async (txs: Tx[]) => {
  if (!txs || txs.length === 0) return;

  await publishMessage("PENDING_TXS_EVENT", {
    txs: txs.map((tx) => {
      return {
        // TODO
        //...Tx.schema.parse(tx.toBuffer()),
        //data: tx.data.toBuffer(),
        //clientIvcProof: tx.clientIvcProof.toBuffer(),
        //contractClassLogs: tx.contractClassLogs.toBuffer(),
        //unencryptedLogs: tx.unencryptedLogs.toBuffer(),
        //encryptedLogs: tx.encryptedLogs.toBuffer(),
        //noteEncryptedLogs: tx.noteEncryptedLogs.toBuffer(),
        //enqueuedPublicFunctionCalls: tx.enqueuedPublicFunctionCalls.map((call) =>
        //  call.toBuffer()
        //),
        //publicTeardownFunctionCall: {
        //  callContext: {
        //    ...tx.publicTeardownFunctionCall.callContext,
        //    contractAddress: tx.publicTeardownFunctionCall.callContext.contractAddress.toString(),
        //    msgSender: tx.publicTeardownFunctionCall.callContext.msgSender.toString(),
        //    functionSelector: tx.publicTeardownFunctionCall.callContext.functionSelector.toString(),
        //  },
        //  args: tx.publicTeardownFunctionCall.args.map((arg) => arg.toString()),
        //},
        hash: tx.getTxHash().toString(),
        birthTimestamp: new Date().getTime(),
      };
    }),
  } as PendingTxsEvent);
};

export const onChainInfo = async (chainInfo: ChicmozChainInfo) => {
  const event = { chainInfo };
  logger.info(`🦊 publishing CHAIN_INFO_EVENT...`);
  await publishMessage("CHAIN_INFO_EVENT", event);
};

export const onL2SequencerInfo = async (
  sequencerInfo: ChicmozL2SequencerInfo
) => {
  const event = { sequencerInfo };
  logger.info(`🦊 publishing SEQUENCER_INFO_EVENT...`);
  await publishMessage("SEQUENCER_INFO_EVENT", event);
};

export const onL2RpcNodeError = (rpcNodeError: ChicmozL2RpcNodeError) => {
  let event;
  try {
    event = { nodeError: chicmozL2RpcNodeErrorSchema.parse(rpcNodeError) };
  } catch (e) {
    logger.warn(`🦊 onL2RpcNodeError on parse error: ${(e as Error).message}`);
    return;
  }
  logger.info(`🦊 publishing L2_RPC_NODE_ERROR_EVENT...`);
  publishMessageSync("L2_RPC_NODE_ERROR_EVENT", event);
};

export const onL2RpcNodeAlive = (rpcUrl: ChicmozL2RpcNode["rpcUrl"]) => {
  let event;
  try {
    event = { rpcUrl, timestamp: new Date().getTime() };
  } catch (e) {
    logger.warn(`🦊 onL2RpcNodeAlive on parse error: ${(e as Error).message}`);
    return;
  }
  logger.info(`🦊 publishing L2_RPC_NODE_ALIVE_EVENT...`);
  publishMessageSync("L2_RPC_NODE_ALIVE_EVENT", event);
};
