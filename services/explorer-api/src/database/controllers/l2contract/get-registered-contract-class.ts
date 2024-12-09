import {
  chicmozL2ContractClassRegisteredEventSchema,
  type ChicmozL2ContractClassRegisteredEvent,
} from "@chicmoz-pkg/types";
import { and, desc, eq } from "drizzle-orm";
import { DB_MAX_CONTRACTS } from "../../../environment.js";
import { getDb as db } from "../../../database/index.js";
import { l2ContractClassRegistered } from "../../schema/l2contract/index.js";
import { l2Block } from "../../schema/index.js";

export const getL2RegisteredContractClass = async (
  classId: ChicmozL2ContractClassRegisteredEvent["contractClassId"],
  version: ChicmozL2ContractClassRegisteredEvent["version"]
): Promise<ChicmozL2ContractClassRegisteredEvent | null> => {
  const res = await getL2RegisteredContractClasses(classId, version);
  return res.length > 0 ? res[0] : null;
};

export const getL2RegisteredContractClasses = async (
  classId?: ChicmozL2ContractClassRegisteredEvent["contractClassId"],
  version?: ChicmozL2ContractClassRegisteredEvent["version"]
): Promise<Array<ChicmozL2ContractClassRegisteredEvent>> => {
  if (classId === undefined && version !== undefined)
    throw new Error("Specifying version but not classId is not allowed");
  if (classId === undefined) return getLatestL2RegisteredContractClasses();
  const whereQuery = version
    ? and(
        eq(l2ContractClassRegistered.contractClassId, classId),
        eq(l2ContractClassRegistered.version, version)
      )
    : eq(l2ContractClassRegistered.contractClassId, classId);
  const limit = version ? 1 : DB_MAX_CONTRACTS;

  const result = await db()
    .select({
      blockHash: l2ContractClassRegistered.blockHash,
      contractClassId: l2ContractClassRegistered.contractClassId,
      version: l2ContractClassRegistered.version,
      artifactHash: l2ContractClassRegistered.artifactHash,
      privateFunctionsRoot: l2ContractClassRegistered.privateFunctionsRoot,
      packedBytecode: l2ContractClassRegistered.packedBytecode,
    })
    .from(l2ContractClassRegistered)
    .where(whereQuery)
    .limit(limit)
    .orderBy(desc(l2ContractClassRegistered.version));

  return result.map((r) =>
    chicmozL2ContractClassRegisteredEventSchema.parse(r)
  );
};

export const getLatestL2RegisteredContractClasses = async (): Promise<
  Array<ChicmozL2ContractClassRegisteredEvent>
> => {
  const result = await db()
    .select({
      blockHash: l2ContractClassRegistered.blockHash,
      contractClassId: l2ContractClassRegistered.contractClassId,
      version: l2ContractClassRegistered.version,
      artifactHash: l2ContractClassRegistered.artifactHash,
      privateFunctionsRoot: l2ContractClassRegistered.privateFunctionsRoot,
      packedBytecode: l2ContractClassRegistered.packedBytecode,
    })
    .from(l2ContractClassRegistered)
    .innerJoin(l2Block, eq(l2Block.hash, l2ContractClassRegistered.blockHash))
    .orderBy(desc(l2ContractClassRegistered.version), desc(l2Block.height))
    .limit(DB_MAX_CONTRACTS);

  return result.map((r) =>
    chicmozL2ContractClassRegisteredEventSchema.parse(r)
  );
};
