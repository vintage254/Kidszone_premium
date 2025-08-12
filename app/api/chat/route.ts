import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/database/drizzle";
import { chatMessages } from "@/database/schema";
import { eq } from "drizzle-orm";
import { getUserByClerkId } from "@/lib/services/user.service";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await getUserByClerkId(userId);
  if (!dbUser) return NextResponse.json({ error: "User record not found" }, { status: 400 });

  const rows = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.userId, dbUser.id))
    .orderBy(chatMessages.createdAt);

  return NextResponse.json({ success: true, data: rows });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await getUserByClerkId(userId);
  if (!dbUser) return NextResponse.json({ error: "User record not found" }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const content = (body?.content as string | undefined)?.trim();
  if (!content) return NextResponse.json({ error: "Message content is required" }, { status: 400 });

  const [inserted] = await db
    .insert(chatMessages)
    .values({ userId: dbUser.id, sender: "USER", content })
    .returning();

  return NextResponse.json({ success: true, data: inserted });
}
