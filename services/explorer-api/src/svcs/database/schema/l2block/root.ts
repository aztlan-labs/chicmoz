import { HexString } from "@chicmoz-pkg/types";
import { bigint, pgTable, unique, varchar } from "drizzle-orm/pg-core";

import { generateTreeTable } from "../utils.js";

export const l2Block = pgTable(
  "l2Block",
  {
    hash: varchar("hash").primaryKey().notNull().$type<HexString>(),
    height: bigint("height", { mode: "bigint" }).notNull(),
  },
  (t) => ({
    unq: unique().on(t.height),
  })
);

export const archive = generateTreeTable(
  "archive",
  varchar("block_hash")
    .notNull()
    .references(() => l2Block.hash, { onDelete: "cascade" })
);
