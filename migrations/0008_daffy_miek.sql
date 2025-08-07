CREATE TYPE "public"."bid_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "bids" (
	"id" text PRIMARY KEY NOT NULL,
	"job_id" text NOT NULL,
	"tutor_id" uuid NOT NULL,
	"proposal" text NOT NULL,
	"status" "bid_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tutor_applications" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "tutor_applications" CASCADE;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "title" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "level" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "level" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "budget" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "budget" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "is_published" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "is_published" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "deadline" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "payoutMethod" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phoneNumber" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "accountHolderName" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "accountNumber" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bankName" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "card_expiry_month" varchar(2);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "card_expiry_year" varchar(4);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "card_cvc" varchar(4);--> statement-breakpoint
ALTER TABLE "bids" ADD CONSTRAINT "bids_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bids" ADD CONSTRAINT "bids_tutor_id_users_id_fk" FOREIGN KEY ("tutor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "language_focus";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "updated_at";--> statement-breakpoint
DROP TYPE "public"."application_status";