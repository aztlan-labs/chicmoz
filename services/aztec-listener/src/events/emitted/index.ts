import { L2Block, Tx } from "@aztec/aztec.js";
import {
  ConnectedToAztecEvent,
  PendingTxsEvent,
} from "@chicmoz-pkg/message-registry";
import { logger } from "../../logger.js";
import { getNodeInfo } from "../../svcs/aztec/network-client.js";
import { publishMessage } from "../../svcs/message-bus/index.js";

export const onBlock = async (block: L2Block) => {
  const height = Number(block.header.globalVariables.blockNumber);
  logger.info(`🦊 publishing block ${height}...`);
  const blockStr = block.toString();
  await publishMessage("NEW_BLOCK_EVENT", {
    block: blockStr,
    blockNumber: height,
    nodeInfo: getNodeInfo(),
  });
};

export const onCatchupBlock = async (block: L2Block) => {
  const blockStr = block.toString();
  await publishMessage("CATCHUP_BLOCK_EVENT", {
    block: blockStr,
    blockNumber: Number(block.header.globalVariables.blockNumber),
    nodeInfo: getNodeInfo(),
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

export const onConnectedToAztec = async (event: ConnectedToAztecEvent) => {
  await publishMessage("CONNECTED_TO_AZTEC_EVENT", event);
};
