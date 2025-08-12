"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/database/drizzle";
import { chatMessages, users, type ChatMessage } from "@/database/schema";
import { and, desc, eq } from "drizzle-orm";
import { isAdminOrSeller, getUserByClerkId } from "@/lib/services/user.service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function sendMessageFromUser(content: string) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, message: "Unauthorized" };
  }
  const dbUser = await getUserByClerkId(userId);
  if (!dbUser) {
    return { success: false, message: "User record not found" };
  }
  if (!content || !content.trim()) {
    return { success: false, message: "Message content is required" };
  }

  const [inserted] = await db
    .insert(chatMessages)
    .values({
      userId: dbUser.id,
      sender: "USER",
      content: content.trim(),
    })
    .returning();

  return { success: true, data: inserted } as const;
}

export async function getMyMessages() {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, message: "Unauthorized" };
  }
  const dbUser = await getUserByClerkId(userId);
  if (!dbUser) {
    return { success: false, message: "User record not found" };
  }

  const rows = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.userId, dbUser.id))
    .orderBy(chatMessages.createdAt);

  return { success: true, data: rows } as const;
}

export type ThreadSummary = {
  userId: string;
  userEmail: string | null;
  userName: string | null;
  lastMessage: string;
  lastSender: "USER" | "ADMIN";
  lastAt: Date | null;
  unreadByAdmin: number;
};

export async function adminGetThreads() {
  const allowed = await isAdminOrSeller();
  if (!allowed) return { success: false, message: "Forbidden" } as const;

  const rows = await db
    .select({
      id: chatMessages.id,
      userId: chatMessages.userId,
      sender: chatMessages.sender,
      content: chatMessages.content,
      createdAt: chatMessages.createdAt,
      readByAdmin: chatMessages.readByAdmin,
      userEmail: users.email,
      userName: users.fullName,
    })
    .from(chatMessages)
    .leftJoin(users, eq(chatMessages.userId, users.id))
    .orderBy(desc(chatMessages.createdAt));

  const map = new Map<string, ThreadSummary>();
  for (const r of rows) {
    const existing = map.get(r.userId);
    if (!existing) {
      map.set(r.userId, {
        userId: r.userId,
        userEmail: r.userEmail ?? null,
        userName: r.userName ?? null,
        lastMessage: r.content,
        lastSender: r.sender as "USER" | "ADMIN",
        lastAt: r.createdAt,
        unreadByAdmin: 0,
      });
    }
  }

  // Count unread messages (from USER, unread by admin)
  for (const r of rows) {
    if (r.sender === "USER" && !r.readByAdmin) {
      const item = map.get(r.userId);
      if (item) item.unreadByAdmin += 1;
    }
  }

  return { success: true, data: Array.from(map.values()) } as const;
}

export async function adminGetThread(targetUserId: string) {
  const allowed = await isAdminOrSeller();
  if (!allowed) return { success: false, message: "Forbidden" } as const;
  if (!targetUserId) return { success: false, message: "userId is required" } as const;

  const rows = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.userId, targetUserId))
    .orderBy(chatMessages.createdAt);

  return { success: true, data: rows } as const;
}

export async function adminSendMessage(targetUserId: string, content: string) {
  const allowed = await isAdminOrSeller();
  if (!allowed) return { success: false, message: "Forbidden" } as const;
  if (!targetUserId) return { success: false, message: "userId is required" } as const;
  if (!content || !content.trim()) return { success: false, message: "Message content is required" } as const;

  const [inserted] = await db
    .insert(chatMessages)
    .values({
      userId: targetUserId,
      sender: "ADMIN",
      content: content.trim(),
    })
    .returning();

  return { success: true, data: inserted } as const;
}

export async function adminSendMessageForm(formData: FormData) {
  const userId = String(formData.get("userId") || "");
  const content = String(formData.get("content") || "");
  const res = await adminSendMessage(userId, content);
  revalidatePath("/admin/chatbox");
  redirect(`/admin/chatbox?userId=${userId}`);
}

export async function markThreadReadByAdmin(targetUserId: string) {
  const allowed = await isAdminOrSeller();
  if (!allowed) return { success: false, message: "Forbidden" } as const;
  if (!targetUserId) return { success: false, message: "userId is required" } as const;

  await db
    .update(chatMessages)
    .set({ readByAdmin: true })
    .where(and(eq(chatMessages.userId, targetUserId), eq(chatMessages.sender, "USER")));

  return { success: true } as const;
}
