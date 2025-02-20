import { pgTable, varchar, integer } from "drizzle-orm/pg-core";

export const heightsTable = pgTable(
  "heights",
  {
    networkId: varchar("networkId").primaryKey().notNull(),
    processedProposedBlockHeight: integer("processedProposedBlockHeight").notNull(),
    chainProposedBlockHeight: integer("chainProposedBlockHeight").notNull(),
    processedProvenBlockHeight: integer("processedProvenBlockHeight").notNull(),
    chainProvenBlockHeight: integer("chainProvenBlockHeight").notNull(),
  }
);
