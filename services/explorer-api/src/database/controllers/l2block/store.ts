/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  HexString,
  type ChicmozL2Block,
  type UnencryptedLogEntry,
} from "@chicmoz-pkg/types";
import { v4 as uuidv4 } from "uuid";
import { getDb as db } from "../../../database/index.js";
import {
  archive,
  body,
  contentCommitment,
  functionLogs,
  gasFees,
  globalVariables,
  header,
  l1ToL2MessageTree,
  l2Block,
  lastArchive,
  logs,
  noteHashTree,
  nullifierTree,
  partial,
  publicDataTree,
  publicDataWrite,
  state,
  txEffect,
  txEffectToLogs,
} from "../../../database/schema/l2block/index.js";

export const store = async (block: ChicmozL2Block): Promise<void> => {
  return await db().transaction(async (dbTx) => {
    // Insert l2Block
    await dbTx.insert(l2Block).values({
      hash: block.hash,
      height: block.header.globalVariables.blockNumber,
    });

    const headerId = uuidv4();
    // Insert header
    await dbTx.insert(header).values({
      id: headerId,
      blockHash: block.hash,
      totalFees: block.header.totalFees,
    });

    // Insert archive
    await dbTx.insert(archive).values({
      root: block.archive.root,
      nextAvailableLeafIndex: block.archive.nextAvailableLeafIndex,
      fk: block.hash,
    });

    const lastArchiveId = uuidv4();
    // Insert last archive
    await dbTx.insert(lastArchive).values({
      id: lastArchiveId,
      root: block.header.lastArchive.root,
      nextAvailableLeafIndex: block.header.lastArchive.nextAvailableLeafIndex,
      fk: headerId,
    });

    const contentCommitmentId = uuidv4();
    // Insert content commitment
    await dbTx.insert(contentCommitment).values({
      id: contentCommitmentId,
      headerId: headerId,
      numTxs: block.header.contentCommitment.numTxs,
      txsEffectsHash: block.header.contentCommitment.txsEffectsHash,
      inHash: block.header.contentCommitment.inHash,
      outHash: block.header.contentCommitment.outHash,
    });

    const stateId = uuidv4();
    // Insert state
    await dbTx.insert(state).values({
      id: stateId,
      headerId,
    });

    const l1ToL2MessageTreeId = uuidv4();
    // Insert l1ToL2MessageTree
    await dbTx.insert(l1ToL2MessageTree).values({
      id: l1ToL2MessageTreeId,
      root: block.header.state.l1ToL2MessageTree.root,
      nextAvailableLeafIndex:
        block.header.state.l1ToL2MessageTree.nextAvailableLeafIndex,
      fk: stateId,
    });

    const partialId = uuidv4();
    // Insert partial
    await dbTx.insert(partial).values({
      id: partialId,
      stateId,
    });

    const noteHashTreeId = uuidv4();
    // Insert partial state trees
    await dbTx.insert(noteHashTree).values({
      id: noteHashTreeId,
      root: block.header.state.partial.noteHashTree.root,
      nextAvailableLeafIndex:
        block.header.state.partial.noteHashTree.nextAvailableLeafIndex,
      fk: partialId,
    });

    const nullifierTreeId = uuidv4();
    await dbTx.insert(nullifierTree).values({
      id: nullifierTreeId,
      root: block.header.state.partial.nullifierTree.root,
      nextAvailableLeafIndex:
        block.header.state.partial.nullifierTree.nextAvailableLeafIndex,
      fk: partialId,
    });

    const publicDataTreeId = uuidv4();
    await dbTx.insert(publicDataTree).values({
      id: publicDataTreeId,
      root: block.header.state.partial.publicDataTree.root,
      nextAvailableLeafIndex:
        block.header.state.partial.publicDataTree.nextAvailableLeafIndex,
      fk: partialId,
    });

    const globalVariablesId = uuidv4();
    // Insert global variables
    await dbTx.insert(globalVariables).values({
      id: globalVariablesId,
      headerId,
      chainId: block.header.globalVariables.chainId,
      version: block.header.globalVariables.version,
      blockNumber: block.header.globalVariables.blockNumber,
      slotNumber: block.header.globalVariables.slotNumber,
      timestamp: block.header.globalVariables.timestamp,
      coinbase: block.header.globalVariables.coinbase,
      feeRecipient: block.header.globalVariables.feeRecipient,
    });

    const gasFeesId = uuidv4();
    // Insert gas fees
    await dbTx.insert(gasFees).values({
      id: gasFeesId,
      globalVariablesId,
      feePerDaGas: block.header.globalVariables.gasFees.feePerDaGas,
      feePerL2Gas: block.header.globalVariables.gasFees.feePerL2Gas,
    });

    const bodyId = uuidv4();
    // Insert body
    await dbTx.insert(body).values({
      id: bodyId,
      blockHash: block.hash,
    });

    // Insert txEffects and create junction entries
    for (const [i, txEff] of Object.entries(block.body.txEffects)) {
      if (isNaN(Number(i))) throw new Error("Invalid txEffect index");
      await dbTx.insert(txEffect).values({
        hash: txEff.hash,
        txHash: txEff.txHash,
        bodyId,
        index: Number(i),
        revertCode: txEff.revertCode.code,
        transactionFee: txEff.transactionFee,
        noteHashes: txEff.noteHashes as HexString[],
        nullifiers: txEff.nullifiers as HexString[],
        l2ToL1Msgs: txEff.l2ToL1Msgs as HexString[],
        unencryptedLogsLength: txEff.unencryptedLogsLength,
        privateLogs: txEff.privateLogs,
      });

      // Insert public data writes
      for (const [pdwIndex, pdw] of Object.entries(txEff.publicDataWrites)) {
        const publicDataWriteId = uuidv4();
        await dbTx.insert(publicDataWrite).values({
          id: publicDataWriteId,
          txEffectHash: txEff.hash,
          index: Number(pdwIndex),
          leafSlot: pdw.leafSlot,
          value: pdw.value,
        });
      }

      for (const [logType, fLogs] of Object.entries({
        unencrypted: txEff.unencryptedLogs.functionLogs,
      })) {
        const txEffectToLogsId = uuidv4();
        // Create junction entry for txEffectToLogs
        await dbTx.insert(txEffectToLogs).values({
          id: txEffectToLogsId,
          txEffectHash: txEff.hash,
        });
        for (const [functionLogIndex, functionLog] of Object.entries(fLogs)) {
          // Insert logs
          const functionLogId = uuidv4();
          await dbTx.insert(functionLogs).values({
            id: functionLogId,
            index: Number(functionLogIndex),
            txEffectToLogsId,
          });
          for (const [index, log] of Object.entries(
            functionLog.logs as Array<UnencryptedLogEntry>
          )) {
            const logId = uuidv4();
            await dbTx.insert(logs).values({
              id: logId,
              index: Number(index),
              txEffectToLogsId,
              type: logType,
              data: log.data,
              contractAddress: log.contractAddress,
            });
          }
        }
      }
    }
  });
};
