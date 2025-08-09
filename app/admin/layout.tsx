import React, { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import "@/styles/admin.css";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { isAdminOrSeller, syncClerkUserWithDatabase } from "@/lib/services/user.service";

const Layout = async ({ children }: { children: ReactNode }) => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  // Check if user has admin or seller role from database
  const hasAdminAccess = await isAdminOrSeller();

  if (!hasAdminAccess) redirect("/");

  return (
    <main className="flex min-h-screen w-full flex-row">
      <Sidebar />

      <div className="admin-container">
        <Header />
        {children}
      </div>
    </main>
  );
};

export default Layout;