CREATE TABLE IF NOT EXISTS "heights" (
	"contractName" varchar NOT NULL,
	"contractAddress" varchar NOT NULL,
	"eventName" varchar NOT NULL,
	"latestWatchedHeight" bigint DEFAULT 0::bigint NOT NULL,
	"pendingHeightLastUpdated" timestamp DEFAULT now() NOT NULL,
	"latestFinalizedHeight" bigint DEFAULT 0::bigint NOT NULL,
	"finalizedHeightLastUpdated" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pending_height_pk" PRIMARY KEY("contractName","contractAddress","eventName")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "l1ContractAddresses" (
	"addresses" jsonb NOT NULL,
	"networkId" varchar PRIMARY KEY NOT NULL,
	"lastUpdated" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
