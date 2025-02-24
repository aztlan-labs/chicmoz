import {
  bigint,
  jsonb,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const l1ContractAddressesTable = pgTable("l1ContractAddresses", {
  addresses: jsonb("addresses").notNull(),
  networkId: varchar("networkId").primaryKey().notNull(),
  lastUpdated: timestamp("lastUpdated").notNull().defaultNow(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const pendingHeightTable = pgTable("pendingHeight", {
  networkId: varchar("networkId").primaryKey().notNull(),
  latestHeight: bigint("latestWatchedHeight", {
    mode: "bigint",
  }).notNull(),
  lastUpdated: timestamp("lastUpdated").notNull().defaultNow(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const finalizedHeightTable = pgTable("finalizedHeight", {
  networkId: varchar("networkId").primaryKey().notNull(),
  latestHeight: bigint("latestWatchedHeight", {
    mode: "bigint",
  }).notNull(),
  lastUpdated: timestamp("lastUpdated").notNull().defaultNow(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
