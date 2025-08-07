CREATE TABLE "job_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"job_id" uuid NOT NULL,
	"borrow_date" timestamp with time zone DEFAULT now() NOT NULL,
	"due_date" date,
	"return_date" date,
	"status" "borrow_status" DEFAULT 'BORROWED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "job_applications_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"author" varchar(255) NOT NULL,
	"genre" text NOT NULL,
	"rating" integer NOT NULL,
	"cover_url" text NOT NULL,
	"cover_color" varchar(7) NOT NULL,
	"description" text NOT NULL,
	"total_copies" integer DEFAULT 1 NOT NULL,
	"available_copies" integer DEFAULT 0 NOT NULL,
	"video_url" text NOT NULL,
	"summary" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "jobs_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DROP TABLE "books" CASCADE;--> statement-breakpoint
DROP TABLE "borrow_records" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profile_picture_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "education_level" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "years_of_experience" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "preferred_student_types" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "teaching_subjects" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "teaching_certificate_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "cv_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "government_id_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "weekly_availability" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hourly_rate" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "teaching_methods" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "tutor_policy_agreement" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profile_completion_percentage" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stripe_account_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "workflow_status" text DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_email_sent" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_attempts" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "rejection_reason" text;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;