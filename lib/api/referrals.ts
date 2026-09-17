import { apiFetch } from "./client";
import type { Referral } from "./types";

/** AFFILIATE_MARKETER only — the referrals attributed to the authenticated marketer. */
export async function listMyReferrals(): Promise<Referral[]> {
  return apiFetch<Referral[]>("/referrals/mine");
}

export async function getReferral(id: string): Promise<Referral> {
  return apiFetch<Referral>(`/referrals/${id}`);
}

