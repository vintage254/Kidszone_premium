ALTER TABLE "cart" ADD COLUMN "filters" jsonb;--> statement-breakpoint
ALTER TABLE "cart" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();