ALTER TABLE "l2_contract_class_registered" ADD COLUMN "is_token_contract" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "l2_contract_class_registered" ADD COLUMN "why_not_token" varchar;