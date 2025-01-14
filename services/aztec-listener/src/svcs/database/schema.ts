import { pgTable, varchar, integer } from "drizzle-orm/pg-core";

export const latestProcessedHeight = pgTable(
  "latest_processed_height",
  {
    networkId: varchar("networkId").primaryKey().notNull(),
    height: integer("height"),
  }
);
