"use client";

import { SessionProvider } from "next-auth/react";
import { UserProvider } from "@/lib/user-context";
import { ToastProvider } from "@/components/ui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserProvider>
        <ToastProvider>{children}</ToastProvider>
      </UserProvider>
    </SessionProvider>
  );
}