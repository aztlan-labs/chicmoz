import {
  pgTable,
  integer,
  jsonb,
  varchar,
  uuid,
  smallint,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import {
  HexString,
  bufferType,
  generateFrColumn,
  generateTreeTable,
} from "./util.js";

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

export const archive = generateTreeTable("archive");

export const archiveRelations = relations(archive, ({ one }) => ({
  l2Block: one(l2Block),
}));

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

export const headerRelations = relations(header, ({ one }) => ({
  l2Block: one(l2Block),
  lastArchive: one(archive, {
    fields: [header.lastArchiveId],
    references: [lastArchive.id],
  }),
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

export const lastArchive = generateTreeTable("last_archive");
export const lastArchiveRelations = relations(lastArchive, ({ one }) => ({
  header: one(header),
}));

export const contentCommitment = pgTable("content_commitment", {
  id: uuid("id").primaryKey().defaultRandom(),
  numTxs: generateFrColumn("num_txs"),
  txsEffectsHash: bufferType("txs_effects_hash").notNull(),
  inHash: bufferType("in_hash").notNull(),
  outHash: bufferType("out_hash").notNull(),
});

export const contentCommitmentRelations = relations(
  contentCommitment,
  ({ one }) => ({
    header: one(header),
  })
);

export const state = pgTable("state", {
  id: uuid("id").primaryKey().defaultRandom(),
  l1ToL2MessageTreeId: uuid("l1_to_l2_message_tree_id")
    .notNull()
    .references(() => l1ToL2MessageTree.id),
  partialId: uuid("partial_id")
    .notNull()
    .references(() => partial.id),
});

export const stateRelations = relations(state, ({ one }) => ({
  header: one(header),
  l1ToL2MessageTree: one(l1ToL2MessageTree, {
    fields: [state.l1ToL2MessageTreeId],
    references: [l1ToL2MessageTree.id],
  }),
  partial: one(partial, {
    fields: [state.partialId],
    references: [partial.id],
  }),
}));

export const l1ToL2MessageTree = generateTreeTable("l1_to_l2_message_tree");
export const l1ToL2MessageTreeRelations = relations(
  l1ToL2MessageTree,
  ({ one }) => ({
    state: one(state),
  })
);

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

export const partialRelations = relations(partial, ({ one }) => ({
  state: one(state),
  noteHashTree: one(noteHashTree, {
    fields: [partial.noteHashTreeId],
    references: [noteHashTree.id],
  }),
  nullifierTree: one(nullifierTree, {
    fields: [partial.nullifierTreeId],
    references: [nullifierTree.id],
  }),
  publicDataTree: one(publicDataTree, {
    fields: [partial.publicDataTreeId],
    references: [publicDataTree.id],
  }),
}));

export const noteHashTree = generateTreeTable("note_hash_tree");
export const noteHashTreeRelations = relations(noteHashTree, ({ one }) => ({
  partial: one(partial),
}));

export const nullifierTree = generateTreeTable("nullifier_tree");
export const nullifierTreeRelations = relations(nullifierTree, ({ one }) => ({
  partial: one(partial),
}));

export const publicDataTree = generateTreeTable("public_data_tree");
export const publicDataTreeRelations = relations(publicDataTree, ({ one }) => ({
  partial: one(partial),
}));

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

export const globalVariablesRelations = relations(
  globalVariables,
  ({ one }) => ({
    header: one(header),
    gasFees: one(gasFees, {
      fields: [globalVariables.gasFeesId],
      references: [gasFees.id],
    }),
  })
);

export const gasFees = pgTable("gas_fees", {
  id: uuid("id").primaryKey().defaultRandom(),
  feePerDaGas: generateFrColumn("fee_per_da_gas"),
  feePerL2Gas: generateFrColumn("fee_per_l2_gas"),
});

export const gasFeesRelations = relations(gasFees, ({ one }) => ({
  globalVariables: one(globalVariables),
}));

export const body = pgTable("body", {
  id: uuid("id").primaryKey().defaultRandom(),
});

export const bodyRelations = relations(body, ({ one, many }) => ({
  l2Block: one(l2Block),
  bodyToTxEffects: many(bodyToTxEffects),
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

export const txEffect = pgTable("tx_effect", {
  id: uuid("id").primaryKey().defaultRandom(),
  index: integer("index").notNull(),
  revertCode: smallint("revert_code").notNull(),
  transactionFee: generateFrColumn("transaction_fee"),
  // NOTE: below three are arrays of Fr they might be needed in separate tables
  noteHashes: jsonb("note_hashes").notNull().$type<HexString[]>(),
  nullifiers: jsonb("nullifiers").notNull().$type<HexString[]>(),
  l2ToL1Msgs: jsonb("l2_to_l1_msgs").notNull().$type<HexString[]>(),
  //publicDataWrites: uuid("public_data_writes").notNull().references(() => publicDataWrite.id),
  noteEncryptedLogsLength: generateFrColumn("note_encrypted_logs_length"),
  encryptedLogsLength: generateFrColumn("encrypted_logs_length"),
  unencryptedLogsLength: generateFrColumn("unencrypted_logs_length"),
  noteEncryptedLogs: jsonb("note_encrypted_logs").notNull(),
  encryptedLogs: jsonb("encrypted_logs").notNull(),
  unencryptedLogs: jsonb("unencrypted_logs").notNull(),
});

export const txEffectRelations = relations(txEffect, ({ one, many }) => ({
  bodyToTxEffects: one(bodyToTxEffects),
  publicDataWrite: many(txEffectToPublicDataWrite),
  functionLogs: many(functionLogs),
  txEffectToLogs: many(txEffectToLogs),
}));

export const txEffectToPublicDataWrite = pgTable(
  "tx_effect_to_public_data_write",
  {
    txEffectId: uuid("tx_effect_id")
      .notNull()
      .references(() => txEffect.id),
    publicDataWriteId: uuid("public_data_write_id")
      .notNull()
      .references(() => publicDataWrite.id),
  }
);

export const txEffectToPublicDataWriteRelations = relations(
  txEffectToPublicDataWrite,
  ({ one }) => ({
    txEffect: one(txEffect),
    publicDataWrite: one(publicDataWrite),
  })
);

export const publicDataWrite = pgTable("public_data_write", {
  id: uuid("id").primaryKey().defaultRandom(),
  leafIndex: generateFrColumn("leaf_index"),
  newValue: generateFrColumn("new_value"),
});

export const publicDataWriteRelations = relations(
  publicDataWrite,
  ({ one }) => ({
    txEffect: one(txEffect),
  })
);

export const logs = pgTable("logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  index: integer("index").notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'noteEncrypted', 'encrypted', or 'unencrypted'
  data: varchar("data").notNull(),
  maskedContractAddress: generateFrColumn("masked_contract_address"),
  contractAddress: generateFrColumn("contract_address"),
});

export const functionLogs = pgTable("function_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  txEffectId: uuid("tx_effect_id")
    .notNull()
    .references(() => txEffect.id),
});

export const txEffectToLogs = pgTable("tx_effect_to_logs", {
  txEffectId: uuid("tx_effect_id")
    .notNull()
    .references(() => txEffect.id),
  logId: uuid("log_id")
    .notNull()
    .references(() => logs.id),
  functionLogId: uuid("function_log_id")
    .notNull()
    .references(() => functionLogs.id),
});

export const logsRelations = relations(logs, ({ many }) => ({
  txEffectToLogs: many(txEffectToLogs),
}));

export const functionLogsRelations = relations(
  functionLogs,
  ({ one, many }) => ({
    txEffect: one(txEffect, {
      fields: [functionLogs.txEffectId],
      references: [txEffect.id],
    }),
    txEffectToLogs: many(txEffectToLogs),
  })
);

export const txEffectToLogsRelations = relations(txEffectToLogs, ({ one }) => ({
  txEffect: one(txEffect, {
    fields: [txEffectToLogs.txEffectId],
    references: [txEffect.id],
  }),
  log: one(logs, {
    fields: [txEffectToLogs.logId],
    references: [logs.id],
  }),
  functionLog: one(functionLogs, {
    fields: [txEffectToLogs.functionLogId],
    references: [functionLogs.id],
  }),
}));

