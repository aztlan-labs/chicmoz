import {
  pgTable,
  integer,
  jsonb,
  varchar,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const l2Block = pgTable("l2Block", {
  hash: varchar("hash").primaryKey().notNull(),
  archiveId: uuid("archive_id")
    .notNull()
    .references(() => archive.id),
  headerId: uuid("header_id")
    .notNull()
    .references(() => header.id),
  bodyId: uuid("body_id")
    .notNull()
    .references(() => body.id),
});

export const l2BlockRelations = relations(l2Block, ({ one }) => ({
  archive: one(archive, {
    fields: [l2Block.archiveId],
    references: [archive.id],
  }),
  header: one(header, {
    fields: [l2Block.headerId],
    references: [header.id],
  }),
  body: one(body, {
    fields: [l2Block.bodyId],
    references: [body.id],
  }),
}));

export const archive = pgTable("archive", {
  id: uuid("id").primaryKey().defaultRandom(),
  root: text("root").notNull(),
  nextAvailableLeafIndex: integer("next_available_leaf_index").notNull(),
});

export const archiveRelations = relations(archive, ({ one }) => ({
  l2Block: one(l2Block),
}));

export const header = pgTable("header", {
  id: uuid("id").primaryKey().defaultRandom(),
  lastArchive: jsonb("last_archive").notNull(),
  contentCommitmentId: uuid("content_commitment_id")
    .notNull()
    .references(() => contentCommitment.id),
  stateId: uuid("state_id")
    .notNull()
    .references(() => state.id),
  globalVariablesId: uuid("global_variables_id")
    .notNull()
    .references(() => globalVariables.id),
  totalFees: text("total_fees").notNull(),
});

export const headerRelations = relations(header, ({ one }) => ({
  l2Block: one(l2Block),
  contentCommitment: one(contentCommitment, {
    fields: [header.contentCommitmentId],
    references: [contentCommitment.id],
  }),
  state: one(state, {
    fields: [header.stateId],
    references: [state.id],
  }),
  globalVariables: one(globalVariables, {
    fields: [header.globalVariablesId],
    references: [globalVariables.id],
  }),
}));

export const contentCommitment = pgTable("content_commitment", {
  id: uuid("id").primaryKey().defaultRandom(),
  numTxs: text("num_txs").notNull(),
  txsEffectsHash: jsonb("txs_effects_hash").notNull(),
  inHash: jsonb("in_hash").notNull(),
  outHash: jsonb("out_hash").notNull(),
});

export const contentCommitmentRelations = relations(
  contentCommitment,
  ({ one }) => ({
    header: one(header),
  })
);

export const state = pgTable("state", {
  id: uuid("id").primaryKey().defaultRandom(),
  l1ToL2MessageTree: jsonb("l1_to_l2_message_tree").notNull(),
  partial: jsonb("partial").notNull(),
});

export const stateRelations = relations(state, ({ one }) => ({
  header: one(header),
}));

export const globalVariables = pgTable("global_variables", {
  id: uuid("id").primaryKey().defaultRandom(),
  chainId: varchar("chain_id").notNull(),
  version: varchar("version").notNull(),
  blockNumber: text("block_number").notNull(),
  slotNumber: text("slot_number").notNull(),
  timestamp: text("timestamp").notNull(),
  coinbase: text("coinbase").notNull(),
  feeRecipient: varchar("fee_recipient").notNull(),
  gasFees: jsonb("gas_fees").notNull(),
});

export const globalVariablesRelations = relations(
  globalVariables,
  ({ one }) => ({
    header: one(header),
  })
);

export const body = pgTable("body", {
  id: uuid("id").primaryKey().defaultRandom(),
});

export const bodyRelations = relations(body, ({ one, many }) => ({
  l2Block: one(l2Block),
  bodyToTxEffects: many(bodyToTxEffects),
}));

export const txEffect = pgTable("tx_effect", {
  id: uuid("id").primaryKey().defaultRandom(),
  index: integer("index").notNull(),
  revertCode: jsonb("revert_code").notNull(),
  transactionFee: text("transaction_fee").notNull(),
  noteHashes: jsonb("note_hashes").notNull(),
  nullifiers: jsonb("nullifiers").notNull(),
  l2ToL1Msgs: jsonb("l2_to_l1_msgs").notNull(),
  publicDataWrites: jsonb("public_data_writes").notNull(),
  noteEncryptedLogsLength: text("note_encrypted_logs_length").notNull(),
  encryptedLogsLength: text("encrypted_logs_length").notNull(),
  unencryptedLogsLength: text("unencrypted_logs_length").notNull(),
  noteEncryptedLogs: jsonb("note_encrypted_logs").notNull(),
  encryptedLogs: jsonb("encrypted_logs").notNull(),
  unencryptedLogs: jsonb("unencrypted_logs").notNull(),
});

export const txEffectRelations = relations(txEffect, ({ one }) => ({
  bodyToTxEffects: one(bodyToTxEffects),
}));

export const bodyToTxEffects = pgTable("body_to_tx_effects", {
  bodyId: uuid("body_id")
    .notNull()
    .references(() => body.id),
  txEffectId: uuid("tx_effect_id")
    .notNull()
    .references(() => txEffect.id),
});

export const bodyToTxEffectsRelations = relations(
  bodyToTxEffects,
  ({ one }) => ({
    body: one(body),
    txEffect: one(txEffect),
  })
);
