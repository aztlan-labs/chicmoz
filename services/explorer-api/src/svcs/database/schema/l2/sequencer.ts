import { relations } from "drizzle-orm";
import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { l2NetworkIdDbEnum } from "../utils.js";
import { l2RpcNodeTable } from "./rpc-node.js";

export const l2SequencerTable = pgTable("l2_sequencer", {
  enr: varchar("enr").primaryKey().notNull(),
  rpcUrl: varchar("rpc_url")
    .notNull()
    .references(() => l2RpcNodeTable.rpcUrl, { onDelete: "cascade" }),
  l2NetworkId: l2NetworkIdDbEnum.notNull(),
  protocolVersion: integer("protocol_version").notNull(),
  nodeVersion: varchar("node_version").notNull(),
  l1ChainId: integer("l1_chain_id").notNull(),
  lastSeenAt: timestamp("last_seen_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const l2SequencerRelations = relations(l2SequencerTable, ({ one }) => ({
  rpcNode: one(l2RpcNodeTable),
}));
