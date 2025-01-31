import { bigint, integer, pgTable, primaryKey } from "drizzle-orm/pg-core";

import { generateFrColumn } from "../utils.js";

// TODO: should these have a field for if the block is finalized? (meaning also that l1BlockNumber is optional)
export const l1L2BlockProposedTable = pgTable(
  "l1L2BlockProposed",
  {
    l2BlockNumber: bigint("l2BlockNumber", { mode: "bigint" }).notNull(),
    l1BlockNumber: bigint("l1BlockNumber", { mode: "bigint" }).notNull(),
    l1BlockTimestamp: integer("l1BlockTimestamp").notNull(),
    archive: generateFrColumn("archive").notNull(),
  },
  (t) => ({
    pk: primaryKey({
      name: "block_proposal",
      columns: [t.l2BlockNumber, t.archive],
    }),
  })
);

export const l1L2ProofVerifiedTable = pgTable("l1L2ProofVerified", {
  l2BlockNumber: bigint("l2BlockNumber", { mode: "bigint" })
    .notNull()
    .primaryKey(),
  l1BlockNumber: bigint("l1BlockNumber", { mode: "bigint" }).notNull(),
  l1BlockTimestamp: integer("l1BlockTimestamp").notNull(),
  proverId: generateFrColumn("proverId").notNull(),
});
