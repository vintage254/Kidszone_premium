ALTER TYPE "public"."role" ADD VALUE 'USER';--> statement-breakpoint
ALTER TYPE "public"."role" ADD VALUE 'SELLER';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';