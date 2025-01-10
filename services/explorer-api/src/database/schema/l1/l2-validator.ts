import { pgTable, smallint, timestamp } from "drizzle-orm/pg-core";
import { generateEthAddressColumn, generateFrColumn } from "../utils.js";

export const l1L2ValidatorTable = pgTable("l1_l2_validator", {
  attester: generateEthAddressColumn("attester").primaryKey().notNull(),
  stake: generateFrColumn("stake").notNull(),
  withdrawer: generateEthAddressColumn("withdrawer").notNull(),
  proposer: generateEthAddressColumn("proposer").notNull(),
  status: smallint("status").notNull(),
  firstSeenAt: timestamp("first_seen_at").notNull(),
  latestSeenChangeAt: timestamp("latest_seen_change_at").notNull(),
});

// TODO: separate almost all fields into a separate table with timestamps (so that you can easily see history for each field)
//   e.g.: "at this time they exited" or "at this time they were slashed" or "at this time they increased stake"
