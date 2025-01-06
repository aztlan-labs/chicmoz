import { HexString } from "@chicmoz-pkg/types";
import {
  index,
  integer,
  jsonb,
  pgTable,
  smallint,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  bufferType,
  generateAztecAddressColumn,
  generateFrColumn,
  generateFrNumberColumn,
} from "../utils.js";
import { l2Block } from "./root.js";

export const body = pgTable("body", {
  id: uuid("id").primaryKey().defaultRandom(),
  blockHash: varchar("block_hash")
    .notNull()
    .$type<HexString>()
    .references(() => l2Block.hash, { onDelete: "cascade" }),
});

export const txEffect = pgTable(
  "tx_effect",
  {
    txHash: varchar("tx_hash").notNull().$type<HexString>().primaryKey(),
    bodyId: uuid("body_id")
      .notNull()
      .references(() => body.id, { onDelete: "cascade" }),
    txBirthTimestamp: timestamp("tx_time_of_birth").notNull().defaultNow(),
    index: integer("index").notNull(),
    revertCode: smallint("revert_code").notNull(),
    transactionFee: generateFrNumberColumn("transaction_fee").notNull(),
    // NOTE: below three are arrays of Fr they might be needed in separate tables
    noteHashes: jsonb("note_hashes").notNull(),
    nullifiers: jsonb("nullifiers").notNull(),
    l2ToL1Msgs: jsonb("l2_to_l1_msgs").notNull().$type<HexString[]>(),
    unencryptedLogsLength: generateFrNumberColumn(
      "unencrypted_logs_length"
    ).notNull(),
    privateLogs: jsonb("private_logs").notNull(),
  },
  (table) => ({
    txHashIndex: index("tx_hash_index").on(table.txHash),
  })
);

export const publicDataWrite = pgTable("public_data_write", {
  id: uuid("id").primaryKey().defaultRandom(),
  txEffectHash: varchar("tx_effect_hash")
    .notNull()
    .references(() => txEffect.txHash, { onDelete: "cascade" }),
  index: integer("index").notNull(),
  leafSlot: generateFrColumn("leaf_slot").notNull(),
  value: generateFrColumn("value").notNull(),
});

export const logs = pgTable("logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  // TODO: move index to junction table
  index: integer("index").notNull(),
  txEffectToLogsId: uuid("tx_effect_to_logs_id")
    .notNull()
    .references(() => txEffectToLogs.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 20 }).notNull(), // unencrypted
  data: bufferType("data").notNull(),
  contractAddress: generateAztecAddressColumn("contract_address"),
});

export const functionLogs = pgTable("function_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  index: integer("index").notNull(),
  txEffectToLogsId: uuid("tx_effect_to_logs_id")
    .notNull()
    .references(() => txEffectToLogs.id, { onDelete: "cascade" }),
});

export const txEffectToLogs = pgTable("tx_effect_to_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  txEffectHash: varchar("tx_effect_hash")
    .notNull()
    .references(() => txEffect.txHash, { onDelete: "cascade" }),
});
