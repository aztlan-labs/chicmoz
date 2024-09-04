/* eslint-disable @typescript-eslint/no-unsafe-return */
// TODO: avoig using eslint-disable
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Fr, L2Block } from "@aztec/aztec.js";
import { desc, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../logger.js";
import { getDb as db } from "../index.js";
import {
  archive,
  body,
  contentCommitment,
  globalVariables,
  header,
  l2Block,
  state,
} from "../schema/index.js";

const getLatest = async () => {
  logger.info(`Getting latest block...`);
  const res = await db()
    .select({
      hash: l2Block.hash,
      number: l2Block.number,
      timestamp: l2Block.timestamp,
      archive: archive,
      header: header,
      body: body,
    })
    .from(l2Block)
    .innerJoin(archive, eq(l2Block.archiveId, archive.id))
    .innerJoin(header, eq(l2Block.headerId, header.id))
    .innerJoin(body, eq(l2Block.bodyId, body.id))
    .orderBy(desc(l2Block.number))
    .limit(1)
    .execute();

  if (res.length === 0) return null;
  return res[0];
};

const frValue = (f: Fr) => f.toString();

const store = async (block: L2Block) => {
  const hash = block?.hash()?.toString() as string;
  logger.info(`📦 Storing block ${block.number} hash: ${hash}`);
  if (!hash) throw new Error(`Block ${block.number} could not find hash`);

  return await db().transaction(async (tx) => {
    const archiveId = uuidv4();
    const headerId = uuidv4();
    const bodyId = uuidv4();
    const contentCommitmentId = uuidv4();
    const stateId = uuidv4();
    const globalVariablesId = uuidv4();

    // Insert archive
    await tx.insert(archive).values({
      id: archiveId,
      root: frValue(block.archive.root),
      nextAvailableLeafIndex: block.archive.nextAvailableLeafIndex,
    }).onConflictDoNothing();

    // Insert content commitment
    await tx.insert(contentCommitment).values({
      id: contentCommitmentId,
      numTxs: frValue(block.header.contentCommitment.numTxs),
      txsEffectsHash: block.header.contentCommitment.txsEffectsHash,
      inHash: block.header.contentCommitment.inHash,
      outHash: block.header.contentCommitment.outHash,
    }).onConflictDoNothing();

    // Insert state
    await tx.insert(state).values({
      id: stateId,
      l1ToL2MessageTree: block.header.state.l1ToL2MessageTree,
      partial: block.header.state.partial,
    }).onConflictDoNothing();

    // Insert global variables
    await tx.insert(globalVariables).values({
      id: globalVariablesId,
      chainId: block.header.globalVariables.chainId,
      version: block.header.globalVariables.version,
      blockNumber: frValue(block.header.globalVariables.blockNumber),
      slotNumber: frValue(block.header.globalVariables.slotNumber),
      timestamp: frValue(block.header.globalVariables.timestamp),
      coinbase: block.header.globalVariables.coinbase,
      feeRecipient: block.header.globalVariables.feeRecipient,
      gasFees: block.header.globalVariables.gasFees,
    }).onConflictDoNothing();

    // Insert header
    await tx.insert(header).values({
      id: headerId,
      lastArchive: block.header.lastArchive,
      contentCommitmentId,
      stateId,
      globalVariablesId,
      totalFees: frValue(block.header.totalFees),
    }).onConflictDoNothing();

    // Insert body
    await tx.insert(body).values({
      id: bodyId,
    }).onConflictDoNothing();

    // Insert l2Block
    await tx.insert(l2Block).values({
      hash,
      number: block.number,
      timestamp: block.getStats().blockTimestamp,
      archiveId,
      headerId,
      bodyId,
    }).onConflictDoNothing();
  });
};

export const block = {
  getLatest,
  store,
};
