import { apiFetch, uploadToPresignedUrl } from "./client";
import type { ManagementUser, MarketerStatus, Role } from "./types";

export async function updateUser(
  id: string,
  input: Partial<{
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
    isActive: boolean;
    marketerStatus: MarketerStatus;
  }>,
): Promise<ManagementUser> {
  return apiFetch<ManagementUser>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function uploadUserAvatar(
  id: string,
  file: File,
): Promise<string> {
  const { uploadUrl, publicUrl } = await apiFetch<{
    uploadUrl: string;
    publicUrl: string;
  }>(`/users/${id}/avatar`, {
    method: "POST",
    body: JSON.stringify({ filename: file.name }),
  });
  const avatarUrl = publicUrl;
  await uploadToPresignedUrl(uploadUrl, file);
  await apiFetch<void>(`/users/${id}/avatar/confirm`, {
    method: "POST",
    body: JSON.stringify({ avatarUrl }),
  });
  return avatarUrl;
}

export async function removeUserAvatar(id: string): Promise<void> {
  await apiFetch<void>(`/users/${id}/avatar`, { method: "DELETE" });
}

