import { pgTable, integer, jsonb, bigint } from "drizzle-orm/pg-core";

export const l2Block = pgTable('l2Block', {
  hash: bigint('hash', { mode: 'bigint' }).primaryKey().notNull(),
  number: integer('number').notNull(),
  timestamp: integer('timestamp').notNull(),
  archive: jsonb('archive').notNull(),
  header: jsonb('header').notNull(),
  body: jsonb('body').notNull(),
});

