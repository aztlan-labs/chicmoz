import { HexString } from "@chicmoz-pkg/types";
import { bigint, integer, pgTable, unique, varchar } from "drizzle-orm/pg-core";

import { generateFrColumn, generateTreeTable } from "../utils.js";

export const l2Block = pgTable(
  "l2Block",
  {
    hash: varchar("hash").primaryKey().notNull().$type<HexString>(),
    // TODO: change to bigint
    height: bigint("height", { mode: "number" }).notNull(),
    proposedOnL1_blockNumber: bigint("proposedOnL1_blockNumber", {
      mode: "bigint",
    }),
    proposedOnL1_timestamp: integer("proposedOnL1_timestamp"),
    proofVerifiedOnL1_blockNumber: bigint("proofVerifiedOnL1_blockNumber", {
      mode: "bigint",
    }),
    proofVerifiedOnL1_timestamp: integer("proofVerifiedOnL1_timestamp"),
    proofVerifiedOnL1_proverId: generateFrColumn("proofVerifiedOnL1_proverId"),
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
