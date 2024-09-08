import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { bufferType, generateFrColumn, generateTreeTable } from "../utils.js";

export const header = pgTable("header", {
  id: uuid("id").primaryKey().defaultRandom(),
  // TODO: this is referring to last archive. Can we asume it's always stored, and if so can we reference it?
  lastArchiveId: uuid("last_archive_id")
    .notNull()
    .references(() => lastArchive.id),
  contentCommitmentId: uuid("content_commitment_id")
    .notNull()
    .references(() => contentCommitment.id),
  stateId: uuid("state_id")
    .notNull()
    .references(() => state.id),
  globalVariablesId: uuid("global_variables_id")
    .notNull()
    .references(() => globalVariables.id),
  totalFees: generateFrColumn("total_fees"),
});

export const lastArchive = generateTreeTable("last_archive");

export const contentCommitment = pgTable("content_commitment", {
  id: uuid("id").primaryKey().defaultRandom(),
  numTxs: generateFrColumn("num_txs"),
  txsEffectsHash: bufferType("txs_effects_hash").notNull(),
  inHash: bufferType("in_hash").notNull(),
  outHash: bufferType("out_hash").notNull(),
});

export const state = pgTable("state", {
  id: uuid("id").primaryKey().defaultRandom(),
  l1ToL2MessageTreeId: uuid("l1_to_l2_message_tree_id")
    .notNull()
    .references(() => l1ToL2MessageTree.id),
  partialId: uuid("partial_id")
    .notNull()
    .references(() => partial.id),
});

export const l1ToL2MessageTree = generateTreeTable("l1_to_l2_message_tree");

export const partial = pgTable("partial", {
  id: uuid("id").primaryKey().defaultRandom(),
  noteHashTreeId: uuid("note_hash_tree_id")
    .notNull()
    .references(() => noteHashTree.id),
  nullifierTreeId: uuid("nullifier_tree_id")
    .notNull()
    .references(() => nullifierTree.id),
  publicDataTreeId: uuid("public_data_tree_id")
    .notNull()
    .references(() => publicDataTree.id),
});

export const noteHashTree = generateTreeTable("note_hash_tree");

export const nullifierTree = generateTreeTable("nullifier_tree");

export const publicDataTree = generateTreeTable("public_data_tree");

export const globalVariables = pgTable("global_variables", {
  id: uuid("id").primaryKey().defaultRandom(),
  chainId: generateFrColumn("chain_id"),
  version: generateFrColumn("version"),
  blockNumber: generateFrColumn("block_number"),
  slotNumber: generateFrColumn("slot_number"),
  timestamp: generateFrColumn("timestamp"),
  coinbase: varchar("coinbase", { length: 42 }).notNull(),
  // NOTE: feeRecipient is referred to as "AztecAddress" and not Fr (although it is(?) a Fr)
  feeRecipient: varchar("fee_recipient", { length: 66 }).notNull(),
  gasFeesId: uuid("gas_fees_id")
    .notNull()
    .references(() => gasFees.id),
});

export const gasFees = pgTable("gas_fees", {
  id: uuid("id").primaryKey().defaultRandom(),
  feePerDaGas: generateFrColumn("fee_per_da_gas"),
  feePerL2Gas: generateFrColumn("fee_per_l2_gas"),
});
