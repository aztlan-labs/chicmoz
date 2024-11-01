import { HexString } from "@chicmoz-pkg/types";
import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  foreignKey,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { l2Block } from "../index.js";
import {
  bufferType,
  generateAztecAddressColumn,
  generateFrColumn,
} from "../utils.js";

export const l2ContractInstanceDeployed = pgTable(
  "l2_contract_instance_deployed",
  {
    // TODO: perhaps a different name for this column?
    id: uuid("id").primaryKey().defaultRandom(),
    blockHash: varchar("block_hash")
      .$type<HexString>()
      .notNull()
      .references(() => l2Block.hash),
    address: generateAztecAddressColumn("address").notNull(),
    version: integer("version").notNull(),
    salt: generateFrColumn("salt").notNull(),
    contractClassId: generateFrColumn("contract_class_id").notNull(),
    initializationHash: generateFrColumn("initialization_hash").notNull(),
    deployer: generateAztecAddressColumn("deployer").notNull(),
    publicKeys_masterNullifierPublicKey_x: generateFrColumn(
      "public_keys_master_nullifier_public_key_x"
    ).notNull(),
    publicKeys_masterNullifierPublicKey_y: generateFrColumn(
      "public_keys_master_nullifier_public_key_y"
    ).notNull(),
    publicKeys_masterNullifierPublicKey_isInfinite: boolean(
      "public_keys_master_nullifier_public_key_is_infinite"
    ).notNull(),
    publicKeys_masterNullifierPublicKey_kind: varchar(
      "public_keys_master_nullifier_public_key_kind"
    ).notNull(),
    publicKeys_masterIncomingViewingPublicKey_x: generateFrColumn(
      "public_keys_master_incoming_viewing_public_key_x"
    ).notNull(),
    publicKeys_masterIncomingViewingPublicKey_y: generateFrColumn(
      "public_keys_master_incoming_viewing_public_key_y"
    ).notNull(),
    publicKeys_masterIncomingViewingPublicKey_isInfinite: boolean(
      "public_keys_master_incoming_viewing_public_key_is_infinite"
    ).notNull(),
    publicKeys_masterIncomingViewingPublicKey_kind: varchar(
      "public_keys_master_incoming_viewing_public_key_kind"
    ).notNull(),
    publicKeys_masterOutgoingViewingPublicKey_x: generateFrColumn(
      "public_keys_master_outgoing_viewing_public_key_x"
    ).notNull(),
    publicKeys_masterOutgoingViewingPublicKey_y: generateFrColumn(
      "public_keys_master_outgoing_viewing_public_key_y"
    ).notNull(),
    publicKeys_masterOutgoingViewingPublicKey_isInfinite: boolean(
      "public_keys_master_outgoing_viewing_public_key_is_infinite"
    ).notNull(),
    publicKeys_masterOutgoingViewingPublicKey_kind: varchar(
      "public_keys_master_outgoing_viewing_public_key_kind"
    ).notNull(),
    publicKeys_masterTaggingPublicKey_x: generateFrColumn(
      "public_keys_master_tagging_public_key_x"
    ).notNull(),
    publicKeys_masterTaggingPublicKey_y: generateFrColumn(
      "public_keys_master_tagging_public_key_y"
    ).notNull(),
    publicKeys_masterTaggingPublicKey_isInfinite: boolean(
      "public_keys_master_tagging_public_key_is_infinite"
    ).notNull(),
    publicKeys_masterTaggingPublicKey_kind: varchar(
      "public_keys_master_tagging_public_key_kind"
    ).notNull(),
  },
  (t) => ({
    unq: unique().on(t.contractClassId, t.address, t.version),
    contractClass: foreignKey({
      name: "contract_class",
      columns: [t.contractClassId, t.version],
      foreignColumns: [
        l2ContractClassRegistered.contractClassId,
        l2ContractClassRegistered.version,
      ],
    }),
  })
);

export const l2ContractClassRegistered = pgTable(
  "l2_contract_class_registered",
  {
    blockHash: varchar("block_hash")
      .notNull()
      .references(() => l2Block.hash),
    contractClassId: generateFrColumn("contract_class_id").notNull(),
    version: bigint("version", { mode: "number" }).notNull(),
    artifactHash: generateFrColumn("artifact_hash").notNull(),
    privateFunctionsRoot: generateFrColumn("private_functions_root").notNull(),
    packedPublicBytecode: bufferType("packed_public_bytecode").notNull(),
  },
  (t) => ({
    primaryKey: primaryKey({
      name: "contract_class_id_version",
      columns: [t.contractClassId, t.version],
    }),
  })
);

export const l2ContractInstanceDeployedRelations = relations(
  l2ContractInstanceDeployed,
  ({ one }) => ({
    contractClass: one(l2ContractClassRegistered, {
      fields: [
        l2ContractInstanceDeployed.contractClassId,
        l2ContractInstanceDeployed.version,
      ],
      references: [
        l2ContractClassRegistered.contractClassId,
        l2ContractClassRegistered.version,
      ],
    }),
  })
);

export const l2PrivateFunction = pgTable(
  "l2_private_function",
  {
    contractClassId: generateFrColumn("contract_class_id")
      .notNull(),
    artifactMetadataHash: generateFrColumn("artifact_metadata_hash").notNull(),
    unconstrainedFunctionsArtifactTreeRoot: generateFrColumn(
      "unconstrained_functions_artifact_tree_root"
    ).notNull(),
    privateFunctionTreeSiblingPath: jsonb(
      "private_function_tree_sibling_path"
    ).notNull(),
    privateFunctionTreeLeafIndex: bigint("private_function_tree_leaf_index", {
      mode: "number",
    }).notNull(),
    artifactFunctionTreeSiblingPath: jsonb(
      "artifact_function_tree_sibling_path"
    ).notNull(),
    artifactFunctionTreeLeafIndex: bigint("artifact_function_tree_leaf_index", {
      mode: "number",
    }).notNull(),
    privateFunction_selector_type: varchar(
      "private_function_selector_type"
    ).notNull(), // TODO: enum
    privateFunction_selector_value: varchar(
      "private_function_selector_value"
    ).notNull(),
    privateFunction_metadataHash: generateFrColumn(
      "private_function_metadata_hash"
    ).notNull(),
    privateFunction_vkHash: generateFrColumn(
      "private_function_vk_hash"
    ).notNull(),
    privateFunction_bytecode: bufferType("private_function_bytecode").notNull(),
  },
  (t) => ({
    primaryKey: primaryKey({
      name: "private_function_contract_class",
      columns: [t.contractClassId, t.privateFunction_selector_value],
    }),
  })
);

export const l2UnconstrainedFunction = pgTable(
  "l2_unconstrained_function",
  {
    contractClassId: generateFrColumn("contract_class_id")
      .notNull(),
    artifactMetadataHash: generateFrColumn("artifact_metadata_hash").notNull(),
    privateFunctionsArtifactTreeRoot: generateFrColumn(
      "private_functions_artifact_tree_root"
    ).notNull(),
    artifactFunctionTreeSiblingPath: jsonb(
      "artifact_function_tree_sibling_path"
    ).notNull(),
    artifactFunctionTreeLeafIndex: bigint("artifact_function_tree_leaf_index", {
      mode: "number",
    }).notNull(),
    unconstrainedFunction_selector_type: varchar(
      "unconstrained_function_selector_type"
    ).notNull(), // TODO: enum
    unconstrainedFunction_selector_value: varchar(
      "unconstrained_function_selector_value"
    ).notNull(),
    unconstrainedFunction_metadataHash: generateFrColumn(
      "unconstrained_function_metadata_hash"
    ).notNull(),
    unconstrainedFunction_bytecode: bufferType(
      "unconstrained_function_bytecode"
    ).notNull(),
  },
  (t) => ({
    primaryKey: primaryKey({
      name: "unconstrained_function_contract_class",
      columns: [t.contractClassId, t.unconstrainedFunction_selector_value],
    }),
  })
);

export const l2ContractClassRegisteredRelations = relations(
  l2ContractClassRegistered,
  ({ many }) => ({
    instances: many(l2ContractInstanceDeployed),
    privateFunctions: many(l2PrivateFunction),
    unconstrainedFunctions: many(l2UnconstrainedFunction),
  })
);

export const l2PrivateFunctionRelations = relations(
  l2PrivateFunction,
  ({ many }) => ({
    contractClass: many(l2ContractClassRegistered),
  })
);

export const l2UnconstrainedFunctionRelations = relations(
  l2UnconstrainedFunction,
  ({ many }) => ({
    contractClass: many(l2ContractClassRegistered),
  })
);
