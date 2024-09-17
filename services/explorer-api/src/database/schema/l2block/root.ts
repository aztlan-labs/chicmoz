import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { body } from "./body.js";
import { header } from "./header.js";
import { generateTreeTable } from "../utils.js";

export const l2Block = pgTable("l2Block", {
  hash: varchar("hash").primaryKey().notNull(),
  archiveId: uuid("archive_id")
    .notNull()
    .references(() => archive.id),
  headerId: uuid("header_id")
    .notNull()
    .references(() => header.id),
  bodyId: uuid("body_id")
    .notNull()
    .references(() => body.id),
});

export const archive = generateTreeTable("archive");
