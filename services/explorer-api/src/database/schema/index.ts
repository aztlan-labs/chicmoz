import { pgTable, integer, jsonb, varchar } from "drizzle-orm/pg-core";

export const l2Block = pgTable('l2Block', {
  hash: varchar('hash').primaryKey().notNull(),
  number: integer('number').notNull(),
  timestamp: integer('timestamp').notNull(),
  archive: jsonb('archive').notNull(),
  header: jsonb('header').notNull(),
  body: jsonb('body').notNull(),
});

