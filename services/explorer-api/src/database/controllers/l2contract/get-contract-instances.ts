import { ChicmozL2ContractInstanceDeluxe, HexString, chicmozL2ContractInstanceDeluxeSchema } from "@chicmoz-pkg/types";
import { and, desc, eq } from "drizzle-orm";
import { getDb as db } from "../../../database/index.js";
import {
  l2ContractClassRegistered,
  l2ContractInstanceDeployed,
} from "../../schema/l2contract/index.js";
import { getBlocksWhereRange } from "../utils.js";
import {l2Block} from "../../schema/index.js";

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
      blockHeight: l2Block.height,
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
    .orderBy(desc(l2ContractInstanceDeployed.version), desc(l2Block.height));

  return result.map((r) => chicmozL2ContractInstanceDeluxeSchema.parse(r));
};

export const getL2DeployedContractInstancesByBlockHash = async (
  blockHash: HexString
): Promise<ChicmozL2ContractInstanceDeluxe[]> => {
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

export const getL2DeployedContractInstancesByContractClassId = async (
  contractClassId: string
): Promise<ChicmozL2ContractInstanceDeluxe[]> => {
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
    .where(eq(l2ContractInstanceDeployed.contractClassId, contractClassId))
    .orderBy(desc(l2ContractInstanceDeployed.version));

  return result;
}
