import { HexString } from "@chicmoz-pkg/types";
import { date, jsonb, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const l2Tx = pgTable("tx", {
  hash: varchar("hash").notNull().$type<HexString>().primaryKey(),
  birthTime: date("birth_time").notNull().defaultNow(),
  data: text("data").notNull(),
  noteEncryptedLogs: text("note_encrypted_logs").notNull(),
  encryptedLogs: text("encrypted_logs").notNull(),
  unencryptedLogs: text("unencrypted_logs").notNull(),
  clientIvcProof: text("client_ivc_proof").notNull(),
  enqueuedPublicFunctions: jsonb("enqueued_public_functions").notNull(),
  publicTeardownFunctionCall: text("public_teardown_function_call").notNull(),
});
