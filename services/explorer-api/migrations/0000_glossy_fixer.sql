CREATE TABLE IF NOT EXISTS "aztec-chain-connection" (
	"hash" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"chain_height" integer NOT NULL,
	"latest_processed_height" integer NOT NULL,
	"counter" integer DEFAULT 0 NOT NULL,
	"rpc_url" varchar NOT NULL,
	"node_version" varchar NOT NULL,
	"l1_chain_id" integer NOT NULL,
	"protocol_version" integer NOT NULL,
	"enr" varchar,
	"l1_contract_addresses" jsonb NOT NULL,
	"protocol_contract_addresses" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "archive" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"root" varchar(66),
	"next_available_leaf_index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "l2Block" (
	"hash" varchar PRIMARY KEY NOT NULL,
	"height" bigint NOT NULL,
	"archive_id" uuid NOT NULL,
	"header_id" uuid NOT NULL,
	"body_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "body" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "body_to_tx_effects" (
	"body_id" uuid NOT NULL,
	"tx_effect_hash" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "function_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"index" integer NOT NULL,
	"type" varchar(20) NOT NULL,
	"data" varchar NOT NULL,
	"masked_contract_address" varchar(66),
	"contract_address" varchar(66)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "public_data_write" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"leaf_index" varchar(66) NOT NULL,
	"new_value" varchar(66) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tx_effect" (
	"hash" varchar PRIMARY KEY NOT NULL,
	"index" integer NOT NULL,
	"revert_code" smallint NOT NULL,
	"transaction_fee" bigint NOT NULL,
	"note_hashes" jsonb NOT NULL,
	"nullifiers" jsonb NOT NULL,
	"l2_to_l1_msgs" jsonb NOT NULL,
	"note_encrypted_logs_length" bigint NOT NULL,
	"encrypted_logs_length" bigint NOT NULL,
	"unencrypted_logs_length" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tx_effect_to_logs" (
	"tx_effect_hash" varchar NOT NULL,
	"function_log_id" uuid NOT NULL,
	"log_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tx_effect_to_public_data_write" (
	"tx_effect_hash" varchar NOT NULL,
	"index" integer NOT NULL,
	"public_data_write_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "content_commitment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"num_txs" bigint NOT NULL,
	"txs_effects_hash" "bytea" NOT NULL,
	"in_hash" "bytea" NOT NULL,
	"out_hash" "bytea" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gas_fees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fee_per_da_gas" bigint,
	"fee_per_l2_gas" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "global_variables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chain_id" bigint NOT NULL,
	"version" bigint NOT NULL,
	"block_number" bigint NOT NULL,
	"slot_number" bigint NOT NULL,
	"timestamp" bigint NOT NULL,
	"coinbase" varchar(42) NOT NULL,
	"fee_recipient" varchar(66) NOT NULL,
	"gas_fees_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "header" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"last_archive_id" uuid NOT NULL,
	"content_commitment_id" uuid NOT NULL,
	"state_id" uuid NOT NULL,
	"global_variables_id" uuid NOT NULL,
	"total_fees" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "l1_to_l2_message_tree" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"root" varchar(66),
	"next_available_leaf_index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "last_archive" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"root" varchar(66),
	"next_available_leaf_index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "note_hash_tree" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"root" varchar(66),
	"next_available_leaf_index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nullifier_tree" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"root" varchar(66),
	"next_available_leaf_index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "partial" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"note_hash_tree_id" uuid NOT NULL,
	"nullifier_tree_id" uuid NOT NULL,
	"public_data_tree_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "public_data_tree" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"root" varchar(66),
	"next_available_leaf_index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "state" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"l1_to_l2_message_tree_id" uuid NOT NULL,
	"partial_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "l2_contract_class_registered" (
	"block_hash" varchar NOT NULL,
	"contract_class_id" varchar(66) NOT NULL,
	"version" bigint NOT NULL,
	"artifact_hash" varchar(66) NOT NULL,
	"private_functions_root" varchar(66) NOT NULL,
	"packed_public_bytecode" "bytea" NOT NULL,
	CONSTRAINT "contract_class_id_version" PRIMARY KEY("contract_class_id","version")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "l2_contract_instance_deployed" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"block_hash" varchar NOT NULL,
	"address" varchar(66) NOT NULL,
	"version" integer NOT NULL,
	"salt" varchar(66) NOT NULL,
	"contract_class_id" varchar(66) NOT NULL,
	"initialization_hash" varchar(66) NOT NULL,
	"deployer" varchar(66) NOT NULL,
	"public_keys_master_nullifier_public_key_x" varchar(66) NOT NULL,
	"public_keys_master_nullifier_public_key_y" varchar(66) NOT NULL,
	"public_keys_master_nullifier_public_key_is_infinite" boolean NOT NULL,
	"public_keys_master_nullifier_public_key_kind" varchar NOT NULL,
	"public_keys_master_incoming_viewing_public_key_x" varchar(66) NOT NULL,
	"public_keys_master_incoming_viewing_public_key_y" varchar(66) NOT NULL,
	"public_keys_master_incoming_viewing_public_key_is_infinite" boolean NOT NULL,
	"public_keys_master_incoming_viewing_public_key_kind" varchar NOT NULL,
	"public_keys_master_outgoing_viewing_public_key_x" varchar(66) NOT NULL,
	"public_keys_master_outgoing_viewing_public_key_y" varchar(66) NOT NULL,
	"public_keys_master_outgoing_viewing_public_key_is_infinite" boolean NOT NULL,
	"public_keys_master_outgoing_viewing_public_key_kind" varchar NOT NULL,
	"public_keys_master_tagging_public_key_x" varchar(66) NOT NULL,
	"public_keys_master_tagging_public_key_y" varchar(66) NOT NULL,
	"public_keys_master_tagging_public_key_is_infinite" boolean NOT NULL,
	"public_keys_master_tagging_public_key_kind" varchar NOT NULL,
	CONSTRAINT "l2_contract_instance_deployed_contract_class_id_address_version_unique" UNIQUE("contract_class_id","address","version")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "l2Block" ADD CONSTRAINT "l2Block_archive_id_archive_id_fk" FOREIGN KEY ("archive_id") REFERENCES "public"."archive"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "l2Block" ADD CONSTRAINT "l2Block_header_id_header_id_fk" FOREIGN KEY ("header_id") REFERENCES "public"."header"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "l2Block" ADD CONSTRAINT "l2Block_body_id_body_id_fk" FOREIGN KEY ("body_id") REFERENCES "public"."body"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "body_to_tx_effects" ADD CONSTRAINT "body_to_tx_effects_body_id_body_id_fk" FOREIGN KEY ("body_id") REFERENCES "public"."body"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "body_to_tx_effects" ADD CONSTRAINT "body_to_tx_effects_tx_effect_hash_tx_effect_hash_fk" FOREIGN KEY ("tx_effect_hash") REFERENCES "public"."tx_effect"("hash") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tx_effect_to_logs" ADD CONSTRAINT "tx_effect_to_logs_tx_effect_hash_tx_effect_hash_fk" FOREIGN KEY ("tx_effect_hash") REFERENCES "public"."tx_effect"("hash") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tx_effect_to_logs" ADD CONSTRAINT "tx_effect_to_logs_function_log_id_function_logs_id_fk" FOREIGN KEY ("function_log_id") REFERENCES "public"."function_logs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tx_effect_to_logs" ADD CONSTRAINT "tx_effect_to_logs_log_id_logs_id_fk" FOREIGN KEY ("log_id") REFERENCES "public"."logs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tx_effect_to_public_data_write" ADD CONSTRAINT "tx_effect_to_public_data_write_tx_effect_hash_tx_effect_hash_fk" FOREIGN KEY ("tx_effect_hash") REFERENCES "public"."tx_effect"("hash") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tx_effect_to_public_data_write" ADD CONSTRAINT "tx_effect_to_public_data_write_public_data_write_id_public_data_write_id_fk" FOREIGN KEY ("public_data_write_id") REFERENCES "public"."public_data_write"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "global_variables" ADD CONSTRAINT "global_variables_gas_fees_id_gas_fees_id_fk" FOREIGN KEY ("gas_fees_id") REFERENCES "public"."gas_fees"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "header" ADD CONSTRAINT "header_last_archive_id_last_archive_id_fk" FOREIGN KEY ("last_archive_id") REFERENCES "public"."last_archive"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "header" ADD CONSTRAINT "header_content_commitment_id_content_commitment_id_fk" FOREIGN KEY ("content_commitment_id") REFERENCES "public"."content_commitment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "header" ADD CONSTRAINT "header_state_id_state_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."state"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "header" ADD CONSTRAINT "header_global_variables_id_global_variables_id_fk" FOREIGN KEY ("global_variables_id") REFERENCES "public"."global_variables"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "partial" ADD CONSTRAINT "partial_note_hash_tree_id_note_hash_tree_id_fk" FOREIGN KEY ("note_hash_tree_id") REFERENCES "public"."note_hash_tree"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "partial" ADD CONSTRAINT "partial_nullifier_tree_id_nullifier_tree_id_fk" FOREIGN KEY ("nullifier_tree_id") REFERENCES "public"."nullifier_tree"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "partial" ADD CONSTRAINT "partial_public_data_tree_id_public_data_tree_id_fk" FOREIGN KEY ("public_data_tree_id") REFERENCES "public"."public_data_tree"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "state" ADD CONSTRAINT "state_l1_to_l2_message_tree_id_l1_to_l2_message_tree_id_fk" FOREIGN KEY ("l1_to_l2_message_tree_id") REFERENCES "public"."l1_to_l2_message_tree"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "state" ADD CONSTRAINT "state_partial_id_partial_id_fk" FOREIGN KEY ("partial_id") REFERENCES "public"."partial"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "l2_contract_class_registered" ADD CONSTRAINT "l2_contract_class_registered_block_hash_l2Block_hash_fk" FOREIGN KEY ("block_hash") REFERENCES "public"."l2Block"("hash") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "l2_contract_instance_deployed" ADD CONSTRAINT "l2_contract_instance_deployed_block_hash_l2Block_hash_fk" FOREIGN KEY ("block_hash") REFERENCES "public"."l2Block"("hash") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "l2_contract_instance_deployed" ADD CONSTRAINT "contract_class" FOREIGN KEY ("contract_class_id","version") REFERENCES "public"."l2_contract_class_registered"("contract_class_id","version") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
