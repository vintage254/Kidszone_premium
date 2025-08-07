"use server";

import { db } from "@/database/drizzle";
import { users, bids, type User } from "@/database/schema";
import { and, count, eq, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type ProgressStatus = 'Not Started' | 'In Progress' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Complete' | 'Available' | 'Not Available';

export async function getUserProfileCardData(userId: string) {
  try {
    const userQuery = db
      .select({
        profileCompletionPercentage: users.profileCompletionPercentage,
        workflow_status: users.workflow_status,
        fullName: users.fullName,
        profilePictureUrl: users.profilePictureUrl,
      })
      .from(users)
      .where(eq(users.id, userId));
    
    const jobsQuery = db
      .select({ 
        worksDone: count(bids.id) 
      })
      .from(bids)
      .where(and(eq(bids.tutorId, userId), eq(bids.status, "approved")));

    const [userData, jobData] = await Promise.all([userQuery, jobsQuery]);

    if (!userData[0]) {
      throw new Error("User not found");
    }

    const user = userData[0];
    const { worksDone } = jobData[0] || { worksDone: 0 };
    const completion = user.profileCompletionPercentage ?? 0;

    // Step 1: Basic Info
    const step1Complete = completion >= 33;

    // Step 2: Verification
    let step2Status: ProgressStatus = 'Not Started';
    if (user.workflow_status === 'pending') {
      step2Status = 'Under Review';
    } else if (user.workflow_status === 'approved') {
      step2Status = 'Approved';
    } else if (user.workflow_status === 'rejected') {
      step2Status = 'Rejected';
    } else if (completion >= 66) {
      step2Status = 'Submitted';
    } else if (completion >= 33) {
      step2Status = 'In Progress';
    }

    // Step 3: Payment Setup
    const step3Complete = completion === 100;
    const step2Approved = step2Status === 'Approved';

    const completionPercentage = 
      (step1Complete ? 40 : 0) +
      (step2Approved ? 40 : 0) +
      (step3Complete ? 20 : 0);

    const progress: { step1: ProgressStatus; step2: ProgressStatus; step3: ProgressStatus } = {
      step1: step1Complete ? 'Complete' : 'In Progress',
      step2: step2Status,
      step3: step3Complete ? 'Complete' : (step2Approved ? 'Available' : 'Not Available'),
    };

    return {
      user: {
        name: user.fullName,
        profilePictureUrl: user.profilePictureUrl,
      },
      stats: {
        worksDone: worksDone || 0,
        avgRating: '0.0',
        reviewsCount: 0,
      },
      progress: {
        completionPercentage,
        ...progress
      },
    };
  } catch (error) {
    console.error("Error fetching profile card data:", error);
    return null;
  }
}

interface UpdateUserParams {
  userId: string;
  values: Partial<User>;
}

export const updateUser = async ({ userId, values }: UpdateUserParams) => {
  try {
    const updatedUser = await db
      .update(users)
      .set(values)
      .where(eq(users.id, userId))
      .returning();

    revalidatePath("/user-dashboard");

    return { success: true, data: updatedUser[0] };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: "Could not update user" };
  }
};

interface GetAllUsersParams {
  status?: User['status'];
  minCompletion?: number;
}

export const getAllUsers = async (params?: GetAllUsersParams) => {
  try {
    const conditions = [];
    if (params?.status) {
      conditions.push(eq(users.status, params.status));
    }
    if (typeof params?.minCompletion === 'number') {
      conditions.push(gte(users.profileCompletionPercentage, params.minCompletion));
    }

    if (conditions.length > 0) {
      const query = db.select().from(users).where(and(...conditions));
      return await query;
    }

    const allUsers = await db.select().from(users);
    return allUsers;
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
};

export const approveUser = async (userId: string) => {
  try {
    await db
      .update(users)
      .set({ status: "APPROVED", workflow_status: "approved" })
      .where(eq(users.id, userId));

    revalidatePath("/admin/account-requests");
  } catch (error) {
    console.error("Error approving user:", error);
    throw new Error("Could not approve user");
  }
};

export const getUserById = async (userId: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    return user;
  } catch (error) {
    console.error(`Error fetching user by id: ${userId}`, error);
    return null;
  }
};;
