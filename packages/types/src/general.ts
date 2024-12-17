import { z } from "zod";
import { frSchema } from "./aztec/utils.js";
import { ChicmozL2Block, ChicmozL2PendingTx } from "./index.js";

export const hexStringSchema = z.custom<`0x${string}`>(
  (value) => {
    return (
      typeof value === "string" && value.match(/^0x[0-9a-fA-F]+$/) !== null
    );
  },
  { message: "Expected a hex string" }
);

export type HexString = z.infer<typeof hexStringSchema>;

export const ethAddressSchema = z.custom<`0x${string}`>((value) => {
  if (!value) return false;
  if (!(value as string).length) return false;
  if (!(value as string).match) return false;
  return (
    (value as string).length === 42 &&
    (value as string).match(/^0x[0-9a-fA-F]+$/) !== null
  );
});
export type EthAddress = z.infer<typeof ethAddressSchema>;

// NOTE: it's technically not the same as Fr but practically it is
export const aztecAddressSchema = frSchema;

export type AztecAddress = z.infer<typeof aztecAddressSchema>;

export type WebsocketUpdateMessage = {
  block?: ChicmozL2Block;
  txs?: ChicmozL2PendingTx[];
};
