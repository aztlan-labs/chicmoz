import {
  bigint,
  integer,
  pgTable,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";

import { generateFrColumn } from "../utils.js";

export const l1L2BlockProposedTable = pgTable(
  "l1L2BlockProposed",
  {
    l1ContractAddress: varchar("l1ContractAddress").notNull(),
    l2BlockNumber: bigint("l2BlockNumber", { mode: "bigint" }).notNull(),
    l1BlockNumber: bigint("l1BlockNumber", { mode: "bigint" }).notNull(),
    l1BlockTimestamp: integer("l1BlockTimestamp").notNull(),
    l1BlockHash: varchar("l1BlockHash").notNull(),
    archive: generateFrColumn("archive").notNull(),
  },
  (t) => ({
    pk: primaryKey({
      name: "block_proposal",
      columns: [t.l2BlockNumber, t.archive],
    }),
  })
);

export const l1L2ProofVerifiedTable = pgTable(
  "l1L2ProofVerified",
  {
    l1ContractAddress: varchar("l1ContractAddress").notNull(),
    l2BlockNumber: bigint("l2BlockNumber", { mode: "bigint" }).notNull(),
    l1BlockNumber: bigint("l1BlockNumber", { mode: "bigint" }).notNull(),
    l1BlockTimestamp: integer("l1BlockTimestamp").notNull(),
    l1BlockHash: varchar("l1BlockHash").notNull(),
    proverId: generateFrColumn("proverId").notNull(),
  },
  (t) => ({
    pk: primaryKey({
      name: "proof_verified",
      columns: [t.l2BlockNumber, t.proverId],
    }),
  })
);
