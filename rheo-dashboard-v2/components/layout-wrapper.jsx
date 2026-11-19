"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { AuthProvider, AuthGuard } from "@/components/auth-guard";

export function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login";

  if (isAuthPage) {
    return (
      <AuthProvider>
        {children}
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <AuthGuard>
        <AppShell>{children}</AppShell>
      </AuthGuard>
    </AuthProvider>
  );
}
