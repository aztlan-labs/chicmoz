CREATE TABLE IF NOT EXISTS "archive" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"root" text NOT NULL,
	"next_available_leaf_index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "body" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "body_to_tx_effects" (
	"body_id" uuid NOT NULL,
	"tx_effect_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "content_commitment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"num_txs" text NOT NULL,
	"txs_effects_hash" jsonb NOT NULL,
	"in_hash" jsonb NOT NULL,
	"out_hash" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "global_variables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chain_id" varchar NOT NULL,
	"version" varchar NOT NULL,
	"block_number" text NOT NULL,
	"slot_number" text NOT NULL,
	"timestamp" text NOT NULL,
	"coinbase" text NOT NULL,
	"fee_recipient" varchar NOT NULL,
	"gas_fees" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "header" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"last_archive" jsonb NOT NULL,
	"content_commitment_id" uuid NOT NULL,
	"state_id" uuid NOT NULL,
	"global_variables_id" uuid NOT NULL,
	"total_fees" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "l2Block" (
	"hash" varchar PRIMARY KEY NOT NULL,
	"archive_id" uuid NOT NULL,
	"header_id" uuid NOT NULL,
	"body_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "state" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"l1_to_l2_message_tree" jsonb NOT NULL,
	"partial" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tx_effect" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"index" integer NOT NULL,
	"revert_code" jsonb NOT NULL,
	"transaction_fee" text NOT NULL,
	"note_hashes" jsonb NOT NULL,
	"nullifiers" jsonb NOT NULL,
	"l2_to_l1_msgs" jsonb NOT NULL,
	"public_data_writes" jsonb NOT NULL,
	"note_encrypted_logs_length" text NOT NULL,
	"encrypted_logs_length" text NOT NULL,
	"unencrypted_logs_length" text NOT NULL,
	"note_encrypted_logs" jsonb NOT NULL,
	"encrypted_logs" jsonb NOT NULL,
	"unencrypted_logs" jsonb NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "body_to_tx_effects" ADD CONSTRAINT "body_to_tx_effects_body_id_body_id_fk" FOREIGN KEY ("body_id") REFERENCES "public"."body"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "body_to_tx_effects" ADD CONSTRAINT "body_to_tx_effects_tx_effect_id_tx_effect_id_fk" FOREIGN KEY ("tx_effect_id") REFERENCES "public"."tx_effect"("id") ON DELETE no action ON UPDATE no action;
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
