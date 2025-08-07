"use server";

import { db } from "@/database/drizzle";
import { jobs, bids } from "@/database/schema";
import { and, eq, desc } from "drizzle-orm";
import { jobs as jobsSchema } from '@/database/schema';
import { revalidatePath } from "next/cache";

interface ApplyForJobParams {
  jobId: string;
  tutorId: string;
  proposal: string;
}

export const applyForJob = async (params: ApplyForJobParams) => {
  console.log("Applying for job with:", params);
  try {
    const { jobId, tutorId, proposal } = params;

    // Check if the job exists and is published
    const job = await db.query.jobs.findFirst({
      where: and(eq(jobs.id, jobId), eq(jobs.isPublished, true)),
    });

    if (!job) {
      return { success: false, error: "This job is not available for applications." };
    }

    // Check if the tutor has already applied
    const existingApplication = await db.query.bids.findFirst({
        where: and(eq(bids.jobId, jobId), eq(bids.tutorId, tutorId))
    });

    if (existingApplication) {
        return { success: false, error: "You have already applied for this job." };
    }

    await db.insert(bids).values({
      jobId,
      tutorId,
      proposal,
      status: "pending",
    });

    revalidatePath("/jobs");
    revalidatePath(`/jobs/${jobId}`);
    console.log("Applied for job successfully");
    return { success: true };
  } catch (error) {
    console.error("Failed to apply for job:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
};

export const getJobById = async (jobId: string) => {
  try {
    const job = await db.query.jobs.findFirst({
      where: eq(jobsSchema.id, jobId),
    });

    if (!job) {
      return { success: false, error: "Job not found." };
    }

    return { success: true, data: job };
  } catch (error) {
    console.error("Failed to fetch job:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
};

export const getTutorApplications = async (tutorId: string) => {
    try {
        const applications = await db.query.bids.findMany({
            where: eq(bids.tutorId, tutorId),
            with: {
                job: true, // Include job details with each application
            },
            orderBy: [desc(bids.createdAt)],
        });

        return { success: true, data: applications };
    } catch (error) {
        console.error("Failed to fetch tutor applications:", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}
