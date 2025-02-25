import {
  bigint,
  boolean,
  integer,
  pgTable,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";

import { generateFrColumn } from "../utils.js";

export const l1L2BlockProposedTable = pgTable(
  // TODO: these might be removed and just stored in the generic contract events
  "l1L2BlockProposed",
  {
    l1ContractAddress: varchar("l1ContractAddress").notNull(),
    l2BlockNumber: bigint("l2BlockNumber", { mode: "bigint" }).notNull(),
    l1BlockNumber: bigint("l1BlockNumber", { mode: "bigint" }).notNull(),
    l1BlockTimestamp: integer("l1BlockTimestamp").notNull(),
    l1BlockHash: varchar("l1BlockHash").notNull(),
    isFinalized: boolean("isFinalized").default(false),
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
  // TODO: these might be removed and just stored in the generic contract events
  {
    l1ContractAddress: varchar("l1ContractAddress").notNull(),
    l2BlockNumber: bigint("l2BlockNumber", { mode: "bigint" }).notNull(),
    l1BlockNumber: bigint("l1BlockNumber", { mode: "bigint" }).notNull(),
    l1BlockTimestamp: integer("l1BlockTimestamp").notNull(),
    l1BlockHash: varchar("l1BlockHash").notNull(),
    isFinalized: boolean("isFinalized").default(false),
    proverId: generateFrColumn("proverId").notNull(),
  },
  (t) => ({
    pk: primaryKey({
      name: "proof_verified",
      columns: [t.l2BlockNumber, t.proverId],
    }),
  })
);
