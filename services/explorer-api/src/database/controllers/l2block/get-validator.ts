import { aztecAddressSchema } from "@chicmoz-pkg/types";
import { eq, sum } from "drizzle-orm";
import { z } from "zod";
import { getDb as db } from "../../../database/index.js";
import {
  globalVariables,
  header,
} from "../../../database/schema/l2block/index.js";

const validatorSchema = z.object({
  l2Address: aztecAddressSchema,
  feesReceived: z.coerce.bigint(),
});

export type Validator = z.infer<typeof validatorSchema>;

export const getValidators = async (): Promise<Validator[]> => {
  const res = await db()
    .select({
      l2Address: globalVariables.feeRecipient,
      feesReceived: sum(header.totalFees),
    })
    .from(header)
    .innerJoin(globalVariables, eq(header.id, globalVariables.headerId))
    .groupBy(globalVariables.feeRecipient)
    .execute();

  const validators = res.map((r) => {
    return validatorSchema.parse(r);
  });

  return validators;
};
