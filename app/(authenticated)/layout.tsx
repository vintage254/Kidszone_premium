import { ReactNode, Suspense } from "react";
import Header from "@/components/Header";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import UnverifiedUserToast from "@/components/UnverifiedUserToast";
import { Toaster } from "sonner";

const Layout = async ({ children }: { children: ReactNode }) => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  after(async () => {
    if (!userId) return;

    const user = await db
      .select({ lastActivityDate: users.lastActivityDate })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user[0]?.lastActivityDate === new Date().toISOString().slice(0, 10))
      return;

    await db
      .update(users)
      .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
      .where(eq(users.id, userId));
  });

  return (
    <main className="root-container">
      <Header />
      <div className="mx-auto max-w-7xl">
        <Suspense fallback={null}>
          <UnverifiedUserToast />
        </Suspense>

        <div className="pb-20">{children}</div>
        <Toaster />
      </div>
    </main>
  );
};

export default Layout;
