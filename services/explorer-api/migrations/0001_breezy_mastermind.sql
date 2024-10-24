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
