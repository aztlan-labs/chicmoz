import { chicmozFeeRecipientSchema, type ChicmozFeeRecipient } from "@chicmoz-pkg/types";
import { count, eq, sum } from "drizzle-orm";
import { getDb as db } from "../../../database/index.js";
import {
  globalVariables,
  header,
} from "../../../database/schema/l2block/index.js";

const LIMIT_AVERAGE_BLOCKS = 1000;

const getPartOfTotalFeesReceived = (
  feeRecipients: ChicmozFeeRecipient[]
): ChicmozFeeRecipient[] => {
  const totalFees = feeRecipients.reduce(
    (acc, v) => acc + v.feesReceived,
    BigInt(0)
  );
  return feeRecipients.map((v) => {
    return {
      ...v,
      partOfTotalFeesReceived: parseFloat(
        (Number(v.feesReceived) / Number(totalFees)).toFixed(2)
      ),
    };
  });
};

export const getFeeRecipients = async (): Promise<ChicmozFeeRecipient[]> => {
  const res = await db()
    .select({
      l2Address: globalVariables.feeRecipient,
      feesReceived: sum(header.totalFees),
      nbrOfBlocks: count(header.id),
    })
    .from(header)
    .limit(LIMIT_AVERAGE_BLOCKS)
    .innerJoin(globalVariables, eq(header.id, globalVariables.headerId))
    .groupBy(globalVariables.feeRecipient)
    .execute();

  const feeRecipients = res.map((r) => {
    return chicmozFeeRecipientSchema.parse({
      ...r,
      calculatedForNumberOfBlocks: LIMIT_AVERAGE_BLOCKS,
    });
  });

  return getPartOfTotalFeesReceived(feeRecipients);
};
