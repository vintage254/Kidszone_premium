ALTER TABLE "tutor_applications" DROP CONSTRAINT "tutor_applications_job_id_jobs_id_fk";
--> statement-breakpoint
ALTER TABLE "tutor_applications" DROP CONSTRAINT "tutor_applications_tutor_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tutor_applications" ADD CONSTRAINT "tutor_applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tutor_applications" ADD CONSTRAINT "tutor_applications_tutor_id_users_id_fk" FOREIGN KEY ("tutor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;