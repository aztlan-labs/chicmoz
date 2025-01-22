import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { l2RpcNodeErrorTable } from "./rpc-node-error.js";
import { l2SequencerTable } from "./sequencer.js";

export const l2RpcNodeTable = pgTable("l2_rpc_node", {
  rpcUrl: varchar("rpc_url").primaryKey().notNull(),
  id: uuid("id").defaultRandom().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastSeenAt: timestamp("last_seen_at").defaultNow().notNull(),
});

export const l2RpcNodeRelations = relations(
  l2RpcNodeTable,
  ({ many, one }) => ({
    errors: many(l2RpcNodeErrorTable),
    sequencer: one(l2SequencerTable),
  })
);
