"use server";

import { db } from "@/database/drizzle";
import { bids, jobs } from "@/database/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { invalidateJobsCache } from "@/app/(authenticated)/jobs/page";
import { and, eq, gte, desc } from "drizzle-orm";

export async function createBid(jobId: string, proposal: string) {
  console.log("Creating bid with:", { jobId, proposal });
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to place a bid." };
  }

  try {
    // Check if the tutor has already applied
    const existingApplication = await db.query.bids.findFirst({
        where: and(eq(bids.jobId, jobId), eq(bids.tutorId, session.user.id))
    });

    if (existingApplication) {
        return { success: false, error: "You have already applied for this job." };
    }

    await db.insert(bids).values({
      jobId,
      tutorId: session.user.id,
      proposal,
    });

    revalidatePath('/jobs');
    revalidatePath(`/jobs/${jobId}`);
    revalidatePath('/my-bids');

    // Invalidate the new Redis cache for user bids
    await invalidateJobsCache('bid', session.user.id);

    console.log("Bid created successfully");
    return { success: true };
  } catch (error) {
    console.error("Error creating bid:", error);
    return { error: "Failed to place bid. Please try again." };
  }
}

export async function deleteBid(bidId: string) {
  try {
    await db.delete(bids).where(eq(bids.id, bidId));
    revalidatePath('/my-bids');
    return { success: true };
  } catch (error) {
    console.error("Error deleting bid:", error);
    return { success: false, error: "Failed to delete bid. Please try again." };
  }
}

export async function getUserBids() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  try {
    const userBids = await db
      .select({
        id: bids.id,
        jobTitle: jobs.title,
        status: bids.status,
        createdAt: bids.createdAt,
        jobDeadline: jobs.deadline,
      })
      .from(bids)
      .leftJoin(jobs, eq(bids.jobId, jobs.id))
      .where(eq(bids.tutorId, session.user.id))
      .orderBy(desc(bids.createdAt));

    return userBids;
  } catch (error) {
    console.error("Error fetching user bids:", error);
    return [];
  }
}
