/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  HexString,
  type ChicmozL2Block,
  type EncryptedLogEntry,
  type NoteEncryptedLogEntry,
  type UnencryptedLogEntry,
} from "@chicmoz-pkg/types";
import { v4 as uuidv4 } from "uuid";
import { getDb as db } from "../../../database/index.js";
import {
  archive,
  body,
  bodyToTxEffects,
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
  txEffectToPublicDataWrite,
} from "../../../database/schema/l2block/index.js";

export const store = async (block: ChicmozL2Block): Promise<void> => {
  return await db().transaction(async (dbTx) => {
    const archiveId = uuidv4();
    const headerId = uuidv4();
    const bodyId = uuidv4();
    const contentCommitmentId = uuidv4();
    const stateId = uuidv4();
    const globalVariablesId = uuidv4();
    const lastArchiveId = uuidv4();
    const l1ToL2MessageTreeId = uuidv4();
    const partialId = uuidv4();
    const noteHashTreeId = uuidv4();
    const nullifierTreeId = uuidv4();
    const publicDataTreeId = uuidv4();
    const gasFeesId = uuidv4();

    // Insert archive
    await dbTx.insert(archive).values({
      id: archiveId,
      root: block.archive.root,
      nextAvailableLeafIndex: block.archive.nextAvailableLeafIndex,
    });

    // Insert last archive
    await dbTx.insert(lastArchive).values({
      id: lastArchiveId,
      root: block.header.lastArchive.root,
      nextAvailableLeafIndex: block.header.lastArchive.nextAvailableLeafIndex,
    });

    // Insert content commitment
    await dbTx.insert(contentCommitment).values({
      id: contentCommitmentId,
      numTxs: block.header.contentCommitment.numTxs,
      txsEffectsHash: block.header.contentCommitment.txsEffectsHash,
      inHash: block.header.contentCommitment.inHash,
      outHash: block.header.contentCommitment.outHash,
    });

    // Insert l1ToL2MessageTree
    await dbTx.insert(l1ToL2MessageTree).values({
      id: l1ToL2MessageTreeId,
      root: block.header.state.l1ToL2MessageTree.root,
      nextAvailableLeafIndex:
        block.header.state.l1ToL2MessageTree.nextAvailableLeafIndex,
    });

    // Insert partial state trees
    await dbTx.insert(noteHashTree).values({
      id: noteHashTreeId,
      root: block.header.state.partial.noteHashTree.root,
      nextAvailableLeafIndex:
        block.header.state.partial.noteHashTree.nextAvailableLeafIndex,
    });

    await dbTx.insert(nullifierTree).values({
      id: nullifierTreeId,
      root: block.header.state.partial.nullifierTree.root,
      nextAvailableLeafIndex:
        block.header.state.partial.nullifierTree.nextAvailableLeafIndex,
    });

    await dbTx.insert(publicDataTree).values({
      id: publicDataTreeId,
      root: block.header.state.partial.publicDataTree.root,
      nextAvailableLeafIndex:
        block.header.state.partial.publicDataTree.nextAvailableLeafIndex,
    });

    // Insert partial
    await dbTx.insert(partial).values({
      id: partialId,
      noteHashTreeId,
      nullifierTreeId,
      publicDataTreeId,
    });

    // Insert state
    await dbTx.insert(state).values({
      id: stateId,
      l1ToL2MessageTreeId,
      partialId,
    });

    // Insert gas fees
    await dbTx.insert(gasFees).values({
      id: gasFeesId,
      feePerDaGas: block.header.globalVariables.gasFees.feePerDaGas,
      feePerL2Gas: block.header.globalVariables.gasFees.feePerL2Gas,
    });

    // Insert global variables
    await dbTx.insert(globalVariables).values({
      id: globalVariablesId,
      chainId: block.header.globalVariables.chainId,
      version: block.header.globalVariables.version,
      blockNumber: block.header.globalVariables.blockNumber,
      slotNumber: block.header.globalVariables.slotNumber,
      timestamp: block.header.globalVariables.timestamp,
      coinbase: block.header.globalVariables.coinbase,
      feeRecipient: block.header.globalVariables.feeRecipient,
      gasFeesId,
    });

    // Insert header
    await dbTx.insert(header).values({
      id: headerId,
      lastArchiveId,
      contentCommitmentId,
      stateId,
      globalVariablesId,
      totalFees: block.header.totalFees,
    });

    // Insert body
    await dbTx.insert(body).values({
      id: bodyId,
    });

    // Insert txEffects and create junction entries
    for (const [i, txEff] of Object.entries(block.body.txEffects)) {
      if (isNaN(Number(i))) throw new Error("Invalid txEffect index");
      await dbTx.insert(txEffect).values({
        hash: txEff.hash,
        txHash: txEff.txHash,
        index: Number(i),
        revertCode: txEff.revertCode.code,
        transactionFee: txEff.transactionFee,
        noteHashes: txEff.noteHashes as HexString[],
        nullifiers: txEff.nullifiers as HexString[],
        l2ToL1Msgs: txEff.l2ToL1Msgs as HexString[],
        noteEncryptedLogsLength: txEff.noteEncryptedLogsLength,
        encryptedLogsLength: txEff.encryptedLogsLength,
        unencryptedLogsLength: txEff.unencryptedLogsLength,
      });

      // Create junction entry for bodyToTxEffects
      await dbTx.insert(bodyToTxEffects).values({
        bodyId: bodyId,
        txEffectHash: txEff.hash,
      });

      // Insert public data writes
      for (const [pdwIndex, pdw] of Object.entries(txEff.publicDataWrites)) {
        const publicDataWriteId = uuidv4();
        await dbTx.insert(publicDataWrite).values({
          id: publicDataWriteId,
          leafIndex: pdw.leafIndex,
          newValue: pdw.newValue,
        });

        // Create junction entry for txEffectToPublicDataWrite
        await dbTx.insert(txEffectToPublicDataWrite).values({
          txEffectHash: txEff.hash,
          index: Number(pdwIndex),
          publicDataWriteId: publicDataWriteId,
        });
      }

      for (const [logType, fLogs] of Object.entries({
        noteEncrypted: txEff.noteEncryptedLogs.functionLogs,
        encrypted: txEff.encryptedLogs.functionLogs,
        unencrypted: txEff.unencryptedLogs.functionLogs,
      })) {
        for (const [functionLogIndex, functionLog] of Object.entries(fLogs)) {
          // Insert logs
          const functionLogId = uuidv4();
          await dbTx.insert(functionLogs).values({
            id: functionLogId,
            index: Number(functionLogIndex),
          });
          for (const [index, log] of Object.entries(
            functionLog.logs as Array<
              NoteEncryptedLogEntry | EncryptedLogEntry | UnencryptedLogEntry
            >
          )) {
            const logId = uuidv4();

            await dbTx.insert(logs).values({
              id: logId,
              index: Number(index),
              type: logType,
              data: log.data,
              maskedContractAddress: (log as EncryptedLogEntry)
                .maskedContractAddress,
              contractAddress: (log as UnencryptedLogEntry).contractAddress,
            });

            // Create junction entry for txEffectToLogs
            await dbTx.insert(txEffectToLogs).values({
              txEffectHash: txEff.hash,
              logId: logId,
              functionLogId: functionLogId,
            });
          }
        }
      }
    }

    // Insert l2Block
    await dbTx.insert(l2Block).values({
      hash: block.hash,
      height: block.header.globalVariables.blockNumber,
      archiveId,
      headerId,
      bodyId,
    });
  });
};
