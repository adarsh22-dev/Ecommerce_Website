"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold text-foreground">Account Settings</h2>

      <div className="card p-6">
        <h3 className="font-semibold mb-4">Change Password</h3>
        <div className="space-y-4 max-w-md">
          <Input label="Current Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <Button onClick={() => toast.success("Password updated!")} className="shimmer-btn">Update Password</Button>
        </div>
      </div>

      <div className="card p-6 border-destructive/20">
        <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
        <p className="text-sm text-foreground-secondary mb-4">Permanently delete your account and all associated data.</p>
        <Button variant="destructive" onClick={() => toast.error("This action cannot be undone")}>Delete Account</Button>
      </div>
    </div>
  );
}
