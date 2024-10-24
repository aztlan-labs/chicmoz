import { HexString } from "@chicmoz-pkg/types";
import {
  integer,
  jsonb,
  pgTable,
  smallint,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { generateAztecAddressColumn, generateFrColumn, generateFrNumberColumn } from "../utils.js";

export const body = pgTable("body", {
  id: uuid("id").primaryKey().defaultRandom(),
});

export const bodyToTxEffects = pgTable("body_to_tx_effects", {
  bodyId: uuid("body_id")
    .notNull()
    .references(() => body.id),
  txEffectHash: varchar("tx_effect_hash")
    .notNull()
    .references(() => txEffect.hash),
});

export const txEffect = pgTable("tx_effect", {
  hash: varchar("hash").notNull().$type<HexString>().primaryKey(),
  // TODO: move index to junction table
  index: integer("index").notNull(),
  revertCode: smallint("revert_code").notNull(),
  transactionFee: generateFrNumberColumn("transaction_fee").notNull(),
  // NOTE: below three are arrays of Fr they might be needed in separate tables
  noteHashes: jsonb("note_hashes").notNull(),
  nullifiers: jsonb("nullifiers").notNull(),
  l2ToL1Msgs: jsonb("l2_to_l1_msgs").notNull().$type<HexString[]>(),
  noteEncryptedLogsLength: generateFrNumberColumn("note_encrypted_logs_length").notNull(),
  encryptedLogsLength: generateFrNumberColumn("encrypted_logs_length").notNull(),
  unencryptedLogsLength: generateFrNumberColumn("unencrypted_logs_length").notNull(),
});

export const txEffectToPublicDataWrite = pgTable(
  "tx_effect_to_public_data_write",
  {
    txEffectHash: varchar("tx_effect_hash")
      .notNull()
      .references(() => txEffect.hash),
    index: integer("index").notNull(),
    publicDataWriteId: uuid("public_data_write_id")
      .notNull()
      .references(() => publicDataWrite.id),
  }
);

export const publicDataWrite = pgTable("public_data_write", {
  id: uuid("id").primaryKey().defaultRandom(),
  // TODO: should there be an index here?
  leafIndex: generateFrColumn("leaf_index").notNull(),
  newValue: generateFrColumn("new_value").notNull(),
});

export const logs = pgTable("logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  // TODO: move index to junction table
  index: integer("index").notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'noteEncrypted', 'encrypted', or 'unencrypted'
  data: varchar("data").notNull(),
  maskedContractAddress: generateFrColumn("masked_contract_address"),
  contractAddress: generateAztecAddressColumn("contract_address"),
});

export const functionLogs = pgTable("function_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  index: integer("index").notNull(),
});

export const txEffectToLogs = pgTable("tx_effect_to_logs", {
  txEffectHash: varchar("tx_effect_hash")
    .notNull()
    .references(() => txEffect.hash),
  functionLogId: uuid("function_log_id")
    .notNull()
    .references(() => functionLogs.id),
  logId: uuid("log_id")
    .notNull()
    .references(() => logs.id),
});
