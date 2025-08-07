DROP TABLE "bids" CASCADE;--> statement-breakpoint
DROP TABLE "jobs" CASCADE;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "profile_picture_url";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "bio";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "education_level";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "years_of_experience";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "preferred_student_types";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "teaching_subjects";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "teaching_certificate_url";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "cv_url";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "government_id_url";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "weekly_availability";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "hourly_rate";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "teaching_methods";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "tutor_policy_agreement";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "profile_completion_percentage";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "stripe_account_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "workflow_status";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "rejection_reason";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "payoutMethod";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "country";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "phoneNumber";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "accountHolderName";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "accountNumber";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "bankName";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "card_expiry_month";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "card_expiry_year";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "card_cvc";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "works_done";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "avg_rating";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "reviews_count";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "last_email_sent";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email_attempts";--> statement-breakpoint
DROP TYPE "public"."borrow_status";--> statement-breakpoint
DROP TYPE "public"."bid_status";