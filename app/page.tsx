"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredToken } from "@/lib/api/client";

/**
 * This repo is the marketer side only now (the management dashboard split off
 * into its own repo), so there's no longer a choice to make at "/" — just
 * forward to the dashboard if already signed in, or the sign-in page
 * otherwise, mirroring the redirect-if-signed-in behavior from before the
 * split rather than dropping it.
 */
export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getStoredToken() ? "/marketer/overview" : "/marketer");
  }, [router]);

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center"
      style={{ background: "var(--gradient-green)" }}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
    </div>
  );
}
