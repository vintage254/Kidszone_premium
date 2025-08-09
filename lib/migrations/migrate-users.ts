"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { isNull, eq } from "drizzle-orm";

/**
 * Migration utility to handle existing users in the database
 * This function should be called during the transition period to identify
 * users who need to be linked with Clerk accounts
 */
export async function getUsersWithoutClerkId() {
  try {
    const usersWithoutClerkId = await db
      .select()
      .from(users)
      .where(isNull(users.clerkUserId))
      .limit(50); // Limit to prevent overwhelming output

    return {
      success: true,
      data: usersWithoutClerkId,
      count: usersWithoutClerkId.length
    };
  } catch (error) {
    console.error("Error fetching users without Clerk ID:", error);
    return {
      success: false,
      error: "Failed to fetch users without Clerk ID",
      data: [],
      count: 0
    };
  }
}

/**
 * Get statistics about user migration status
 */
export async function getUserMigrationStats() {
  try {
    const totalUsers = await db.select().from(users);
    const usersWithClerkId = totalUsers.filter(user => user.clerkUserId);
    const usersWithoutClerkId = totalUsers.filter(user => !user.clerkUserId);

    return {
      success: true,
      stats: {
        total: totalUsers.length,
        withClerkId: usersWithClerkId.length,
        withoutClerkId: usersWithoutClerkId.length,
        migrationProgress: totalUsers.length > 0 ? 
          Math.round((usersWithClerkId.length / totalUsers.length) * 100) : 0
      }
    };
  } catch (error) {
    console.error("Error getting user migration stats:", error);
    return {
      success: false,
      error: "Failed to get migration statistics",
      stats: null
    };
  }
}

/**
 * Manually link a database user with a Clerk user ID
 * This can be used for admin management or migration purposes
 */
export async function linkUserWithClerkId(
  databaseUserId: string,
  clerkUserId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const result = await db
      .update(users)
      .set({ clerkUserId })
      .where(eq(users.id, databaseUserId))
      .returning();

    if (result.length > 0) {
      return {
        success: true,
        message: `Successfully linked user ${databaseUserId} with Clerk ID ${clerkUserId}`
      };
    } else {
      return {
        success: false,
        message: `User ${databaseUserId} not found`
      };
    }
  } catch (error) {
    console.error("Error linking user with Clerk ID:", error);
    return {
      success: false,
      message: `Failed to link user: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
