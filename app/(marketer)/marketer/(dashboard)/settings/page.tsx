"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User, Lock, Trash2 } from "lucide-react";
import PageHeader from "@/components/marketer/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAuth } from "@/contexts/auth-context";
import {
  updateUser,
  uploadUserAvatar,
  removeUserAvatar,
} from "@/lib/api/users";
import { getFullName, getInitials } from "@/lib/utils";

export default function MarketerSettingsPage() {
  const { user, refreshProfile } = useAuth();
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [showProfileConfirm, setShowProfileConfirm] = useState(false);

  const [password, setPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [avatarBusy, setAvatarBusy] = useState(false);
  const [showAvatarRemoveConfirm, setShowAvatarRemoveConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName,
        middleName: user.middleName ?? "",
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user]);

  const handleProfileSubmitClick = () => {
    if (!user) return;
    if (!profileForm.firstName.trim() || !profileForm.lastName.trim() || !profileForm.email.trim()) {
      toast.error("First name, last name and email are required.");
      return;
    }
    const hasChanges =
      profileForm.firstName.trim() !== user.firstName ||
      (profileForm.middleName?.trim() || "") !== (user.middleName || "") ||
      profileForm.lastName.trim() !== user.lastName;

    if (!hasChanges) {
      toast.info("No profile changes detected.");
      return;
    }

    setShowProfileConfirm(true);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      await updateUser(user.id, {
        firstName: profileForm.firstName.trim(),
        middleName: profileForm.middleName?.trim() || undefined,
        lastName: profileForm.lastName.trim(),
        email: profileForm.email.trim(),
      });
      await refreshProfile();
      toast.success("Profile updated.");
      setShowProfileConfirm(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not update profile.",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmitClick = () => {
    if (!user) return;
    if (password.length < 12) {
      toast.error("Password must be at least 12 characters.");
      return;
    }
    setShowPasswordConfirm(true);
  };

  const handleChangePassword = async () => {
    if (!user) return;
    setSavingPassword(true);
    try {
      await updateUser(user.id, { password });
      setPassword("");
      toast.success("Password updated.");
      setShowPasswordConfirm(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not update password.",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarBusy(true);
    try {
      await uploadUserAvatar(user.id, file);
      await refreshProfile();
      toast.success("Avatar updated.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not upload avatar.",
      );
    } finally {
      setAvatarBusy(false);
      e.target.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user) return;
    setAvatarBusy(true);
    try {
      await removeUserAvatar(user.id);
      await refreshProfile();
      toast.success("Avatar removed.");
      setShowAvatarRemoveConfirm(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not remove avatar.",
      );
    } finally {
      setAvatarBusy(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="El-Moore Marketer"
        title="Account Settings"
        subtitle="Manage your profile and login details."
      />

      <div className="rounded-md bg-card p-6 shadow-ambient space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Profile Photo</h2>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gold text-secondary-foreground text-lg font-bold">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={getFullName(user)}
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials(user)
            )}
          </div>
          <div className="flex gap-2">
            <label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={avatarBusy}
              />
              <span className="inline-flex h-8 cursor-pointer items-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted transition-colors">
                {avatarBusy ? "Uploading…" : "Change Photo"}
              </span>
            </label>
            {user.avatarUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAvatarRemoveConfirm(true)}
                disabled={avatarBusy}
              >
                <Trash2 className="h-4 w-4" /> Remove
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-md bg-card p-6 shadow-ambient space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <User className="h-4 w-4" /> Profile
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>First Name</Label>
            <Input
              value={profileForm.firstName}
              onChange={(e) =>
                setProfileForm((f) => ({ ...f, firstName: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>Last Name</Label>
            <Input
              value={profileForm.lastName}
              onChange={(e) =>
                setProfileForm((f) => ({ ...f, lastName: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>Middle Name (optional)</Label>
            <Input
              value={profileForm.middleName}
              onChange={(e) =>
                setProfileForm((f) => ({ ...f, middleName: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input type="email" value={profileForm.email} disabled />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleProfileSubmitClick} disabled={savingProfile}>
            {savingProfile ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="rounded-md bg-card p-6 shadow-ambient space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Lock className="h-4 w-4" /> Password
        </h2>
        <div className="grid gap-2 sm:max-w-xs">
          <Label>New Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 12 characters"
          />
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handlePasswordSubmitClick}
            disabled={savingPassword || !password}
          >
            {savingPassword ? "Updating…" : "Update Password"}
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog: Update Profile */}
      <ConfirmDialog
        open={showProfileConfirm}
        onOpenChange={setShowProfileConfirm}
        title="Update Profile Details?"
        description="Are you sure you want to save these changes to your profile information?"
        confirmText="Yes, Update Profile"
        loading={savingProfile}
        onConfirm={handleSaveProfile}
      />

      {/* Confirmation Dialog: Change Password */}
      <ConfirmDialog
        open={showPasswordConfirm}
        onOpenChange={setShowPasswordConfirm}
        title="Change Password?"
        description="Are you sure you want to change your password? You will need to use your new password next time you sign in."
        confirmText="Yes, Change Password"
        loading={savingPassword}
        onConfirm={handleChangePassword}
      />

      {/* Confirmation Dialog: Remove Avatar */}
      <ConfirmDialog
        open={showAvatarRemoveConfirm}
        onOpenChange={setShowAvatarRemoveConfirm}
        title="Remove Profile Photo?"
        description="Are you sure you want to remove your profile photo? This action cannot be undone."
        confirmText="Remove Photo"
        variant="destructive"
        loading={avatarBusy}
        onConfirm={handleRemoveAvatar}
      />
    </div>
  );
}
