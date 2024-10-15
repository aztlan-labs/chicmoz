import { z } from "zod";

export const hexStringSchema = z.custom<`0x${string}`>(
  (value) => {
    return typeof value === "string" && value.match(/^0x[0-9a-fA-F]+$/) !== null;
  },
  { message: "Expected a hex string" }
);

export type HexString = z.infer<typeof hexStringSchema>;
