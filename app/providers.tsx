"use client";

import { SessionProvider } from "next-auth/react";
import { AppContextProvider } from "@/context/AppContext";
import { ReactNode } from "react";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <AppContextProvider>{children}</AppContextProvider>
    </SessionProvider>
  );
};
