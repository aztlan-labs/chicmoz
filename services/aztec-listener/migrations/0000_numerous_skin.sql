CREATE TABLE IF NOT EXISTS "heights" (
	"networkId" varchar PRIMARY KEY NOT NULL,
	"processedProposedBlockHeight" integer NOT NULL,
	"chainProposedBlockHeight" integer NOT NULL,
	"processedProvenBlockHeight" integer NOT NULL,
	"chainProvenBlockHeight" integer NOT NULL
);
