import { aztecAddressSchema } from "@chicmoz-pkg/types";
import { count, eq, sum } from "drizzle-orm";
import { z } from "zod";
import { getDb as db } from "../../../database/index.js";
import {
  globalVariables,
  header,
} from "../../../database/schema/l2block/index.js";

const validatorSchema = z.object({
  l2Address: aztecAddressSchema,
  feesReceived: z.coerce.bigint(),
  blocksProduced: z.number(),
  partOfTotalFeesReceived: z.number().optional(),
});

type Validator = z.infer<typeof validatorSchema>;

const getPartOfTotalFeesReceived = (validators: Validator[]): Validator[] => {
  const totalFees = validators.reduce((acc, v) => acc + v.feesReceived, BigInt(0));
  return validators.map((v) => {
    return {
      ...v,
      partOfTotalFeesReceived: parseFloat((Number(v.feesReceived) / Number(totalFees)).toFixed(2)),
    };
  });
}

export const getValidators = async (): Promise<Validator[]> => {
  const res = await db()
    .select({
      l2Address: globalVariables.feeRecipient,
      feesReceived: sum(header.totalFees),
      blocksProduced: count(header.id),
    })
    .from(header)
    //.limit(1000) // last 1000 blocks
    .innerJoin(globalVariables, eq(header.id, globalVariables.headerId))
    .groupBy(globalVariables.feeRecipient)
    .execute();

  const validators = res.map((r) => {
    return validatorSchema.parse(r);
  });

  return getPartOfTotalFeesReceived(validators);
};
