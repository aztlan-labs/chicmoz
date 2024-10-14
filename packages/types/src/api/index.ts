import { z } from "zod";
import {
  chicmozL2BlockSchema,
  chicmozL2TxEffectSchema,
  chicmozL2ContractClassRegisteredEventSchema,
  chicmozL2ContractInstanceDeployedEventSchema,
} from "../index.js";

export const chicmozSearchResultsSchema = z.object({
  searchPhrase: z.string(),
  results: z.object({
    blocks: z.array(
      z.object({
        hash: chicmozL2BlockSchema.shape.hash,
      })
    ),
    txEffects: z.array(
      z.object({
        hash: chicmozL2TxEffectSchema.shape.hash,
        partOfBlockWithHash: chicmozL2BlockSchema.shape.hash.optional(),
      })
    ),
    registeredContractClasses: z.array(
      z.object({
        contractClassId:
          chicmozL2ContractClassRegisteredEventSchema.shape.contractClassId,
        version: chicmozL2ContractClassRegisteredEventSchema.shape.version,
        partOfBlockWithHash: chicmozL2BlockSchema.shape.hash.optional(),
      })
    ),
    contractInstances: z.array(
      z.object({
        address: chicmozL2ContractInstanceDeployedEventSchema.shape.address,
        partOfBlockWithHash: chicmozL2BlockSchema.shape.hash.optional(),
      })
    ),
  }),
});

export type ChicmozSearchResults = z.infer<typeof chicmozSearchResultsSchema>;
