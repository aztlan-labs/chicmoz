import { sql } from "drizzle-orm";
import {
  bigint,
  jsonb,
  pgTable,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const l1ContractAddressesTable = pgTable("l1ContractAddresses", {
  addresses: jsonb("addresses").notNull(),
  networkId: varchar("networkId").primaryKey().notNull(),
  lastUpdated: timestamp("lastUpdated").notNull().defaultNow(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const heightsTable = pgTable(
  "heights",
  {
    contractName: varchar("contractName").notNull(),
    contractAddress: varchar("contractAddress").notNull(),
    eventName: varchar("eventName").notNull(),
    latestPendingHeight: bigint("latestWatchedHeight", {
      mode: "bigint",
    })
      .notNull()
      .default(sql`0::bigint`),
    pendingHeightLastUpdated: timestamp("pendingHeightLastUpdated")
      .notNull()
      .defaultNow(),
    latestFinalizedHeight: bigint("latestFinalizedHeight", {
      mode: "bigint",
    })
      .notNull()
      .default(sql`0::bigint`),
    finalizedHeightLastUpdated: timestamp("finalizedHeightLastUpdated")
      .notNull()
      .defaultNow(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (t) => ({
    pk: primaryKey({
      name: "pending_height_pk",
      columns: [t.contractName, t.contractAddress, t.eventName],
    }),
  })
);
