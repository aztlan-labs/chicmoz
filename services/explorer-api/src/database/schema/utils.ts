import {
  varchar,
  customType,
  pgTable,
  integer,
  uuid,
} from "drizzle-orm/pg-core";

export const generateFrColumn = (name: string) =>
  varchar(name, { length: 66 });

export const generateTreeTable = (name: string) => pgTable(name, {
  id: uuid("id").primaryKey().defaultRandom(),
  root: generateFrColumn("root"),
  nextAvailableLeafIndex: integer("next_available_leaf_index").notNull(),
});

export const bufferType = customType<{
  data: Buffer
  default: false
}>({
  dataType() {
    return 'bytea'
  },
});

export type HexString = `${"0x"}${string}`;
