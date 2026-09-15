"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

/**
 * This repo is the marketer side only now (the management dashboard split off
 * into its own repo), so there's no longer a choice to make at "/" — just
 * forward to the dashboard if already signed in, or the sign-in page
 * otherwise. Goes through useAuth() (the same user/isLoading AuthProvider
 * exposes to the dashboard layout's own guard) rather than checking the raw
 * token directly, so this agrees with that guard on what "signed in" means —
 * a token whose cached user fails validation is treated as signed out here
 * too, instead of bouncing to /marketer/overview only to immediately bounce
 * again to /marketer.
 */
export default function RootRedirect() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    router.replace(user ? "/marketer/overview" : "/marketer");
  }, [isLoading, user, router]);

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center"
      style={{ background: "var(--gradient-green)" }}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
    </div>
  );
}
