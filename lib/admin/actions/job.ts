"use server";

import { db } from "@/database/drizzle";
import { jobs, bids } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Job } from "@/lib/types";

interface CreateJobParams {
  title: string;
  description: string;
  level: string;
  budget: string;
  deadline: Date;
  isPublished?: boolean;
}

// Action to create a new job posting
// Action to get all job postings
export const getJobs = async (): Promise<{ success: true; data: Job[] } | { success: false; message: string; data?: undefined }> => {
  try {
    const allJobs = await db.select().from(jobs);
        return { success: true, data: allJobs as Job[] };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return { success: false, message: "Failed to fetch jobs." };
  }
};

export const updateJob = async (jobId: string, params: Partial<CreateJobParams>) => {
  try {
    const updatedJob = await db
      .update(jobs)
      .set(params)
      .where(eq(jobs.id, jobId))
      .returning();

    revalidatePath("/admin/jobs");
    revalidatePath(`/admin/jobs/edit/${jobId}`);

    return { success: true, data: updatedJob[0] };
  } catch (error) {
    console.error("Error updating job:", error);
    return { success: false, message: "Failed to update job." };
  }
};

export const createJob = async (params: CreateJobParams) => {
  try {
    const newJob = await db.insert(jobs).values(params).returning();
    revalidatePath("/admin/jobs");
    return { success: true, data: newJob[0] };
  } catch (error) {
    console.error("Error creating job:", error);
    return { success: false, message: "Failed to create job." };
  }
};

// Action to approve a tutor's bid
export const approveBid = async (bidId: string) => {
  try {
    await db
      .update(bids)
      .set({ status: "approved" })
      .where(eq(bids.id, bidId));

    revalidatePath("/admin/bids");
    return { success: true };
  } catch (error) {
    console.error("Error approving bid:", error);
    return { success: false, message: "Failed to approve bid." };
  }
};

// Action to reject a tutor's bid
export const deleteJob = async (jobId: string) => {
  try {
    await db.delete(jobs).where(eq(jobs.id, jobId));

    revalidatePath("/admin/jobs");
    return { success: true };
  } catch (error) {
    console.error("Error deleting job:", error);
    return { success: false, message: "Failed to delete job." };
  }
};

export const rejectBid = async (bidId: string) => {
  try {
    await db
      .update(bids)
      .set({ status: "rejected" })
      .where(eq(bids.id, bidId));

    revalidatePath("/admin/bids");
    return { success: true };
  } catch (error) {
    console.error("Error rejecting bid:", error);
    return { success: false, message: "Failed to reject bid." };
  }
};
