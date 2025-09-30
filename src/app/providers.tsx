"use client";

import { SessionProvider } from "next-auth/react";
import { UserProvider } from "@/lib/user-context";
import { ToastProvider } from "@/components/ui/toast";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserProvider>
        <ToastProvider>
          <AuthGate>{children}</AuthGate>
        </ToastProvider>
      </UserProvider>
    </SessionProvider>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      if (!pathname?.startsWith("/auth")) {
        router.replace("/auth/signin");
      }
    }
  }, [status, pathname, router]);

  return <>{children}</>;
}