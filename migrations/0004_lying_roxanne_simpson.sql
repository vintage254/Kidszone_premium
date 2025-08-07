CREATE TYPE "public"."application_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "tutor_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"tutor_id" uuid NOT NULL,
	"cover_letter" text,
	"status" "application_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "job_applications" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "job_applications" CASCADE;--> statement-breakpoint
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_id_unique";--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "level" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "language_focus" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "budget" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "is_published" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "tutor_applications" ADD CONSTRAINT "tutor_applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tutor_applications" ADD CONSTRAINT "tutor_applications_tutor_id_users_id_fk" FOREIGN KEY ("tutor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "author";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "genre";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "rating";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "cover_url";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "cover_color";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "total_copies";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "available_copies";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "video_url";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "summary";