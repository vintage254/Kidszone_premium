ALTER TABLE "jobs" DROP CONSTRAINT "jobs_id_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_id_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "works_done" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avg_rating" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "reviews_count" integer DEFAULT 0;