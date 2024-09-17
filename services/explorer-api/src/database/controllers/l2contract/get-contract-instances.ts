import {
  ChicmozL2ContractInstanceDeluxe
} from "@chicmoz-pkg/types";
import { and, desc, eq } from "drizzle-orm";
import { getDb as db } from "../../../database/index.js";
import {
  l2ContractClassRegistered,
  l2ContractInstanceDeployed,
} from "../../schema/l2contract/index.js";

export const getL2DeployedContractInstancesByBlockHash = async (
  blockHash: string
): Promise<
  ChicmozL2ContractInstanceDeluxe[]
> => {
  const result = await db()
    .select({
      address: l2ContractInstanceDeployed.address,
      blockHash: l2ContractInstanceDeployed.blockHash,
      version: l2ContractInstanceDeployed.version,
      salt: l2ContractInstanceDeployed.salt,
      contractClassId: l2ContractInstanceDeployed.contractClassId,
      initializationHash: l2ContractInstanceDeployed.initializationHash,
      publicKeysHash: l2ContractInstanceDeployed.publicKeysHash,
      deployer: l2ContractInstanceDeployed.deployer,
      artifactHash: l2ContractClassRegistered.artifactHash,
      privateFunctionsRoot: l2ContractClassRegistered.privateFunctionsRoot,
      packedPublicBytecode: l2ContractClassRegistered.packedPublicBytecode,
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

  return result;
};
