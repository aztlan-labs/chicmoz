import { ChicmozL2ContractInstanceDeluxe, HexString } from "@chicmoz-pkg/types";
import { and, desc, eq, getTableColumns } from "drizzle-orm";
import { getDb as db } from "../../../database/index.js";
import {
  l2ContractClassRegistered,
  l2ContractInstanceDeployed,
} from "../../schema/l2contract/index.js";
import { getBlocksWhereRange } from "../utils.js";
import { l2Block } from "../../schema/index.js";
import { DB_MAX_CONTRACTS } from "../../../environment.js";
import { parseDeluxe } from "./utils.js";

export const getL2DeployedContractInstances = async ({
  fromHeight,
  toHeight,
}: {
  fromHeight?: number;
  toHeight?: number;
}): Promise<ChicmozL2ContractInstanceDeluxe[]> => {
  const whereRange = getBlocksWhereRange({ from: fromHeight, to: toHeight });
  const result = await db()
    .select({
      instance: getTableColumns(l2ContractInstanceDeployed),
      class: getTableColumns(l2ContractClassRegistered),
    })
    .from(l2ContractInstanceDeployed)
    .innerJoin(
      l2ContractClassRegistered,
      and(
        eq(
          l2ContractInstanceDeployed.contractClassId,
          l2ContractClassRegistered.contractClassId
        ),
        eq(
          l2ContractInstanceDeployed.version,
          l2ContractClassRegistered.version
        )
      )
    )
    .innerJoin(l2Block, eq(l2Block.hash, l2ContractInstanceDeployed.blockHash))
    .where(whereRange)
    .orderBy(desc(l2ContractInstanceDeployed.version), desc(l2Block.height))
    .limit(DB_MAX_CONTRACTS);

  return result.map((r) => parseDeluxe(r.class, r.instance));
};

export const getL2DeployedContractInstancesByBlockHash = async (
  blockHash: HexString
): Promise<ChicmozL2ContractInstanceDeluxe[]> => {
  const result = await db()
    .select({
      instance: getTableColumns(l2ContractInstanceDeployed),
      class: getTableColumns(l2ContractClassRegistered),
    })
    .from(l2ContractInstanceDeployed)
    .innerJoin(
      l2ContractClassRegistered,
      and(
        eq(
          l2ContractInstanceDeployed.contractClassId,
          l2ContractClassRegistered.contractClassId
        ),
        eq(
          l2ContractInstanceDeployed.version,
          l2ContractClassRegistered.version
        )
      )
    )
    .where(eq(l2ContractInstanceDeployed.blockHash, blockHash))
    .orderBy(desc(l2ContractInstanceDeployed.version));

  return result.map((r) => parseDeluxe(r.class, r.instance));
};

export const getL2DeployedContractInstancesByContractClassId = async (
  contractClassId: string
): Promise<ChicmozL2ContractInstanceDeluxe[]> => {
  const result = await db()
    .select({
      instance: getTableColumns(l2ContractInstanceDeployed),
      class: getTableColumns(l2ContractClassRegistered),
    })
    .from(l2ContractInstanceDeployed)
    .innerJoin(
      l2ContractClassRegistered,
      and(
        eq(
          l2ContractInstanceDeployed.contractClassId,
          l2ContractClassRegistered.contractClassId
        ),
        eq(
          l2ContractInstanceDeployed.version,
          l2ContractClassRegistered.version
        )
      )
    )
    .where(eq(l2ContractInstanceDeployed.contractClassId, contractClassId))
    .orderBy(desc(l2ContractInstanceDeployed.version))
    .limit(DB_MAX_CONTRACTS);

  return result.map((r) => parseDeluxe(r.class, r.instance));
};
