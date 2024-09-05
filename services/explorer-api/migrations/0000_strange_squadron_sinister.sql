CREATE TABLE IF NOT EXISTS "l2Block" (
	"hash" varchar PRIMARY KEY NOT NULL,
	"number" integer NOT NULL,
	"timestamp" integer NOT NULL,
	"archive" jsonb NOT NULL,
	"header" jsonb NOT NULL,
	"body" jsonb NOT NULL
);
