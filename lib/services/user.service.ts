"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { generateReferenceNumber } from "@/lib/utils";

export interface DatabaseUser {
  id: string;
  clerkUserId: string | null;
  fullName: string;
  email: string;
  role: "ADMIN" | "USER" | "SELLER";
  status: string | null;
  refNo: string;
  lastActivityDate: string | null;
  createdAt: Date | null;
}

/**
 * Get user from database by Clerk user ID
 */
export async function getUserByClerkId(clerkUserId: string): Promise<DatabaseUser | null> {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("Error fetching user by Clerk ID:", error);
    return null;
  }
}

/**
 * Get current authenticated user with database role information
 */
export async function getCurrentUser(): Promise<DatabaseUser | null> {
  try {
    const { userId: clerkUserId } = await auth();
    
    if (!clerkUserId) {
      return null;
    }

    return await getUserByClerkId(clerkUserId);
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Sync Clerk user with database - create or update user record
 */
export async function syncClerkUserWithDatabase(
  clerkUserId: string,
  email: string,
  fullName: string
): Promise<DatabaseUser | null> {
  try {
    // Check if user already exists
    const existingUser = await getUserByClerkId(clerkUserId);
    
    if (existingUser) {
      // Update existing user
      const updated = await db
        .update(users)
        .set({
          fullName,
          email,
          lastActivityDate: new Date().toISOString().slice(0, 10),
        })
        .where(eq(users.clerkUserId, clerkUserId))
        .returning();

      return updated[0] as DatabaseUser;
    } else {
      // Create new user
      const newUser = await db
        .insert(users)
        .values({
          clerkUserId,
          fullName,
          email,
          refNo: generateReferenceNumber(),
          role: "USER", // Default role
          status: "active",
        })
        .returning();

      return newUser[0] as DatabaseUser;
    }
  } catch (error) {
    console.error("Error syncing Clerk user with database:", error);
    return null;
  }
}

/**
 * Check if current user has admin/seller permissions
 */
export async function checkUserRole(requiredRoles: ("ADMIN" | "SELLER" | "USER")[]): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    
    if (!user || !user.role) {
      return false;
    }

    return requiredRoles.includes(user.role);
  } catch (error) {
    console.error("Error checking user role:", error);
    return false;
  }
}

/**
 * Check if current user is admin or seller
 */
export async function isAdminOrSeller(): Promise<boolean> {
  return await checkUserRole(["ADMIN", "SELLER"]);
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  return await checkUserRole(["ADMIN"]);
}
