import { z } from "zod";

export const hexStringSchema = z.custom<`0x${string}`>(
  (value) => {
    return (value as string).startsWith("0x");
  },
  { message: "Expected a hex string" }
);

export type HexString = z.infer<typeof hexStringSchema>;
