"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";

type Status = "loading" | "unauthenticated" | "ready" | "error";

interface DebugInfo {
  user: { id: string; email: string } | null;
  profile: { role: string; status: string } | null;
  profileError: string | null;
}

export default function AdminSetupPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [debug, setDebug] = useState<DebugInfo | null>(null);
  const [fixing, setFixing] = useState(false);
  const [fixResult, setFixResult] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setStatus("loading");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      if (!supabase || !supabase.auth) {
        setStatus("error");
        setDebug({ user: null, profile: null, profileError: "Supabase not configured" });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setStatus("unauthenticated");
        setDebug({ user: null, profile: null, profileError: null });
        return;
      }

      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setDebug({
        user: { id: user.id, email: user.email || "" },
        profile: profile || null,
        profileError: profileErr ? `${profileErr.code}: ${profileErr.message}` : null,
      });
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setDebug({ user: null, profile: null, profileError: String(err) });
    }
  };

  const fixProfile = async () => {
    if (!debug?.user) return;
    setFixing(true);
    setFixResult(null);
    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (!res.ok) {
        setFixResult(`error: ${data.error}`);
      } else {
        setFixResult(`success: ${data.message}`);
      }

      // Refresh
      await checkAuth();
    } catch (err) {
      setFixResult(`error: ${String(err)}`);
    }
    setFixing(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Setup</h1>
          <p className="text-foreground-secondary mt-2">Diagnose and fix admin access</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border p-6 space-y-6">
          {status === "loading" && (
            <div className="flex items-center justify-center gap-3 py-8">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm text-foreground-secondary">Checking authentication...</span>
            </div>
          )}

          {status === "unauthenticated" && (
            <div className="text-center py-8 space-y-4">
              <XCircle className="w-12 h-12 text-destructive mx-auto" />
              <p className="text-foreground font-medium">You are not signed in</p>
              <p className="text-sm text-foreground-secondary">
                Please sign in first, then come back here to set up admin access.
              </p>
              <div className="flex gap-3 justify-center">
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="text-center py-8 space-y-4">
              <XCircle className="w-12 h-12 text-destructive mx-auto" />
              <p className="text-foreground font-medium">Error checking auth</p>
              <p className="text-sm text-foreground-secondary">{debug?.profileError}</p>
              <button
                onClick={checkAuth}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {status === "ready" && debug && (
            <>
              {/* User Info */}
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-3">Account Info</h2>
                <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Email</span>
                    <span className="text-foreground font-medium">{debug.user?.email || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">User ID</span>
                    <span className="text-foreground font-mono text-xs">{debug.user?.id.slice(0, 12)}...</span>
                  </div>
                </div>
              </div>

              {/* Profile Status */}
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-3">Profile Status</h2>
                <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                  {debug.profile ? (
                    <>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-foreground">Profile exists</span>
                      </div>
                      <div className="flex justify-between text-sm pl-6">
                        <span className="text-foreground-secondary">Role</span>
                        <span className={`font-medium ${debug.profile.role === "admin" || debug.profile.role === "super_admin" ? "text-green-600" : "text-destructive"}`}>
                          {debug.profile.role}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm pl-6">
                        <span className="text-foreground-secondary">Status</span>
                        <span className="font-medium text-green-600">active</span>
                      </div>

                      {debug.profile.role !== "admin" && debug.profile.role !== "super_admin" && (
                        <div className="flex items-start gap-2 pt-2 border-t border-border">
                          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                          <div>
                            <p className="text-sm text-foreground font-medium">Wrong role</p>
                            <p className="text-xs text-foreground-secondary">Your role is &quot;{debug.profile.role}&quot;. Click the button below to change it to &quot;admin&quot;.</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-destructive" />
                        <span className="text-sm text-foreground">No profile found</span>
                      </div>
                      <p className="text-xs text-foreground-secondary pl-6">
                        Your auth account exists but no profile was created. Click the button below to create one.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Action */}
              {(!debug.profile || (debug.profile.role !== "admin" && debug.profile.role !== "super_admin")) && (
                <button
                  onClick={fixProfile}
                  disabled={fixing}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {fixing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Fixing...</>
                  ) : debug.profile ? (
                    <><Shield className="w-4 h-4" /> Set Role to Admin</>
                  ) : (
                    <><Shield className="w-4 h-4" /> Create Admin Profile</>
                  )}
                </button>
              )}

              {debug.profile && debug.profile.role === "admin" && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 font-medium">Admin access is set up!</p>
                  <p className="text-green-600 text-sm">Your role is already &quot;admin&quot;.</p>
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Go to Admin Panel
                  </Link>
                </div>
              )}

              {/* Result */}
              {fixResult && (
                <div className={`rounded-xl p-4 text-sm ${
                  fixResult.startsWith("success")
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}>
                  <div className="flex items-center gap-2">
                    {fixResult.startsWith("success") ? (
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span>{fixResult}</span>
                  </div>
                </div>
              )}

              {/* RLS Help */}
              {fixResult?.startsWith("error") && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Could not fix via server</p>
                      <p className="mt-1 text-xs">Run this SQL in your Supabase dashboard SQL Editor:</p>
                      <pre className="mt-2 p-3 bg-amber-100/50 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap">{`UPDATE profiles SET role = 'admin', status = 'approved' WHERE id = '${debug.user?.id || "YOUR_USER_ID"}';`}</pre>
                      {!fixResult?.includes("SUPABASE_SERVICE_ROLE_KEY") && (
                        <p className="mt-2 text-xs">Error: {fixResult?.replace("error: ", "")}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Retry link */}
              <div className="text-center">
                <Link
                  href="/auth"
                  className="text-sm text-primary hover:underline"
                >
                  ← Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
