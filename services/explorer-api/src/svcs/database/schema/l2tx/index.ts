import { HexString } from "@chicmoz-pkg/types";
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const l2Tx = pgTable("tx", {
  hash: varchar("hash").notNull().$type<HexString>().primaryKey(),
  birthTimestamp: timestamp("birth_timestamp").notNull().defaultNow(),
});
