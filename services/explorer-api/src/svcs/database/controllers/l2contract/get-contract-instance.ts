import { getDb as db } from "@chicmoz-pkg/postgres-helper";
import { ChicmozL2ContractInstanceDeluxe, HexString } from "@chicmoz-pkg/types";
import { and, desc, eq, getTableColumns } from "drizzle-orm";
import { logger } from "../../../../logger.js";
import {
  l2ContractClassRegistered,
  l2ContractInstanceDeployed,
  l2ContractInstanceVerifiedDeployment,
} from "../../schema/l2contract/index.js";
import { parseDeluxe } from "./utils.js";

export const getL2DeployedContractInstanceByAddress = async (
  address: HexString
): Promise<ChicmozL2ContractInstanceDeluxe | null> => {
  const result = await db()
    .select({
      instance: getTableColumns(l2ContractInstanceDeployed),
      class: getTableColumns(l2ContractClassRegistered),
      verifiedDeploymentInfo: getTableColumns(
        l2ContractInstanceVerifiedDeployment
      ),
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
    .innerJoin(
      l2ContractInstanceVerifiedDeployment,
      and(
        eq(
          l2ContractInstanceDeployed.address,
          l2ContractInstanceVerifiedDeployment.address
        )
      )
    )
    .where(eq(l2ContractInstanceDeployed.address, address))
    .orderBy(desc(l2ContractInstanceDeployed.version))
    .limit(1);

  if (result.length === 0) {
    logger.info(`No contract instance found for address: ${address}`);
    return null;
  }
  const { instance, class: contractClass, verifiedDeploymentInfo } = result[0];

  return parseDeluxe(contractClass, instance, verifiedDeploymentInfo);
};
