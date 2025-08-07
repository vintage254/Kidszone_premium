"use server";

import { db } from "@/database/drizzle";
import { users, jobs, bids } from "@/database/schema";
import { count, eq, desc, and, gte } from "drizzle-orm";

export const getDashboardData = async () => {
  try {
    const totalUsersPromise = db.select({ total: count(users.id) }).from(users);

    const pendingUsersPromise = db
      .select({ pending: count(users.id) })
      .from(users)
      .where(and(eq(users.status, "PENDING"), gte(users.profileCompletionPercentage, 66)));

    const jobStatsPromise = db.select({ total: count(jobs.id) }).from(jobs);

    const applicationStatsPromise = db.select({ total: count(bids.id) }).from(bids);

    const recentPendingUsersPromise = db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
      })
      .from(users)
      .where(and(eq(users.status, "PENDING"), gte(users.profileCompletionPercentage, 66)))
      .orderBy(desc(users.createdAt))
      .limit(5);

    const [
      totalUsersResult,
      pendingUsersResult,
      jobStats,
      applicationStats,
      recentPendingUsers,
    ] = await Promise.all([
      totalUsersPromise,
      pendingUsersPromise,
      jobStatsPromise,
      applicationStatsPromise,
      recentPendingUsersPromise,
    ]);

    return {
      success: true,
      data: {
        stats: {
          totalUsers: totalUsersResult[0].total,
          pendingUsers: pendingUsersResult[0].pending,
          totalJobs: jobStats[0].total,
          totalApplications: applicationStats[0].total,
        },
        recentPendingUsers,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { success: false, error: "Could not fetch dashboard data." };
  }
};
