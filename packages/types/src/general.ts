import { z } from "zod";
import { frSchema } from "./aztec/utils.js";
import {
  ChicmozL2Block,
  ChicmozL2PendingTx,
  chicmozL2BlockSchema,
} from "./index.js";

export const hexStringSchema = z.custom<`0x${string}`>(
  (value) => {
    return (
      typeof value === "string" && value.match(/^0x[0-9a-fA-F]+$/) !== null
    );
  },
  { message: "Expected a hex string" }
);

export type HexString = z.infer<typeof hexStringSchema>;

export const ethAddressSchema = z.custom<`0x${string}`>(
  (value) => {
    if (!value) throw new Error(`ethAddress is required, got ${JSON.stringify(value)}`);

    if (typeof value !== "string")
      throw new Error(`ethAddress must be a string, got ${typeof value}`);

    if (value.length === 0) throw new Error("ethAddress must not be empty");

    if (!value.startsWith("0x"))
      throw new Error(`ethAddress must start with '0x', got ${value}`);

    if (value.length !== 42) {
      throw new Error(
        `ethAddress must be 42 characters long (including '0x'). Got ${value}`
      );
    }

    if (!value.match(/^0x[0-9a-fA-F]+$/)) {
      throw new Error(
        `ethAddress must be a hex string. Got ${value}`
      );
    }
    return true;
  },
  {
    message: "Invalid ethAddress format",
  }
);
export type EthAddress = z.infer<typeof ethAddressSchema>;

// NOTE: it's technically not the same as Fr but practically it is
export const aztecAddressSchema = frSchema;

export type AztecAddress = z.infer<typeof aztecAddressSchema>;

const stringableChicmozL2BlockSchema = z.lazy(() => {
  return z.object({
    ...chicmozL2BlockSchema.shape,
    header: z.object({
      ...chicmozL2BlockSchema.shape.header.shape,
      totalFees: z.string(),
    }),
  });
});

export type StringableChicmozL2Block = z.infer<
  typeof stringableChicmozL2BlockSchema
>;

export type WebsocketUpdateMessageSender = {
  block?: StringableChicmozL2Block;
  txs?: ChicmozL2PendingTx[];
};

export type WebsocketUpdateMessageReceiver = {
  block?: ChicmozL2Block;
  txs?: ChicmozL2PendingTx[];
};
