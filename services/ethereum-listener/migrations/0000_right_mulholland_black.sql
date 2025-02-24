CREATE TABLE IF NOT EXISTS "finalizedHeight" (
	"networkId" varchar PRIMARY KEY NOT NULL,
	"latestWatchedHeight" bigint NOT NULL,
	"lastUpdated" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "l1ContractAddresses" (
	"addresses" jsonb NOT NULL,
	"networkId" varchar PRIMARY KEY NOT NULL,
	"lastUpdated" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pendingHeight" (
	"networkId" varchar PRIMARY KEY NOT NULL,
	"latestWatchedHeight" bigint NOT NULL,
	"lastUpdated" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
