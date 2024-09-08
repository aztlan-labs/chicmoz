import {
  integer,
  jsonb,
  pgTable,
  smallint,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { HexString, generateFrColumn } from "../utils.js";

export const body = pgTable("body", {
  id: uuid("id").primaryKey().defaultRandom(),
});

export const bodyToTxEffects = pgTable("body_to_tx_effects", {
  bodyId: uuid("body_id")
    .notNull()
    .references(() => body.id),
  txEffectId: uuid("tx_effect_id")
    .notNull()
    .references(() => txEffect.id),
});

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

export const publicDataWrite = pgTable("public_data_write", {
  id: uuid("id").primaryKey().defaultRandom(),
  leafIndex: generateFrColumn("leaf_index"),
  newValue: generateFrColumn("new_value"),
});

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
