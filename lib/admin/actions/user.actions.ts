"use server";

"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { triggerTutorStatusWorkflow } from "@/lib/workflow";

export const approveTutor = async (userId: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new Error("User not found");
    }

    await db
      .update(users)
      .set({ status: "APPROVED" })
      .where(eq(users.id, userId));

    await triggerTutorStatusWorkflow({
      type: "APPROVAL",
      email: user.email,
      fullName: user.fullName!,
    });

    revalidatePath("/admin/users");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to approve tutor." };
  }
};

export const rejectTutor = async (userId: string, reason: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new Error("User not found");
    }

    await db
      .update(users)
      .set({ status: "REJECTED", rejection_reason: reason })
      .where(eq(users.id, userId));

    await triggerTutorStatusWorkflow({
      type: "REJECTION",
      email: user.email,
      fullName: user.fullName!,
      reason,
    });

    revalidatePath("/admin/users");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to reject tutor." };
  }
};
