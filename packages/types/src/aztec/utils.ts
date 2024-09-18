import { z } from "zod";

export type AztecFr = {
  toString(): string;
};

export type AztecAddress = {
  toString(): string;
};

export type StringifiedAztecFr = {
  type: "Fr";
  value: `0x${string}`;
};

export type StringifiedAztecAddress = {
  type: "AztecAddress";
  value: `0x${string}`;
};

export const frSchema = z.preprocess(
  (val) => {
    if ((val as StringifiedAztecFr).value)
      return (val as StringifiedAztecFr).value;
    else if ((val as AztecFr).toString) return (val as AztecFr).toString();
    else return val;
  },
  z
    .string()
    .length(66)
    .regex(/^0x[0-9a-fA-F]+$/)
);

// NOTE: it's technically not the same as Fr but practically it is
export const aztecAddressSchema = frSchema;

export type StringifiedBuffer = {
  type: "Buffer";
  data: number[];
};

export const bufferSchema = z.preprocess(
  (val) => {
    if ((val as StringifiedBuffer).data)
      return Buffer.from((val as StringifiedBuffer).data);
    return val;
  },
  z.custom<Buffer>(
    (value) => {
      return value instanceof Buffer;
    },
    { message: "Expected a Buffer" }
  )
);
