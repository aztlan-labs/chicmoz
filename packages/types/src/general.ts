import { z } from "zod";

export const hexStringSchema = z.custom<`0x${string}`>(
  (value) => {
    return typeof value === "string" && value.match(/^0x[0-9a-fA-F]+$/) !== null;
  },
  { message: "Expected a hex string" }
);

export type HexString = z.infer<typeof hexStringSchema>;

export const ethAddressSchema = z.string().length(42).regex(/^0x[0-9a-fA-F]+$/);
export type EthAddress = z.infer<typeof ethAddressSchema>;
