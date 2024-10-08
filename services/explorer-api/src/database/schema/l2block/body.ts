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
  txEffectId: uuid("tx_effect_id")
    .notNull()
    .references(() => txEffect.id),
});

export const txEffect = pgTable("tx_effect", {
  // TODO: replace id with hash as PK - maybe?
  id: uuid("id").primaryKey().defaultRandom(),
  hash: varchar("hash").notNull().$type<HexString>(),
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
    txEffectId: uuid("tx_effect_id")
      .notNull()
      .references(() => txEffect.id),
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
  txEffectId: uuid("tx_effect_id")
    .notNull()
    .references(() => txEffect.id),
  functionLogId: uuid("function_log_id")
    .notNull()
    .references(() => functionLogs.id),
  logId: uuid("log_id")
    .notNull()
    .references(() => logs.id),
});
