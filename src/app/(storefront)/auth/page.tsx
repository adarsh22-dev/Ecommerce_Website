"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Building2, Store, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/contexts/auth-context";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [loginType, setLoginType] = useState<"customer" | "admin">("customer");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState<"customer" | "vendor" | "wholesaler">("customer");
  const { signIn, signUp, signInWithGoogle, signOut } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const redirectTo = searchParams.get("redirect") || "/";

  const getRoleRedirect = (role?: string) => {
    switch (role) {
      case "admin":
      case "super_admin":
        return "/admin";
      case "vendor":
        return "/vendor";
      case "wholesaler":
        return "/wholesaler";
      default:
        return redirectTo;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (loginType === "admin") {
        const result = await signIn(email, password);
        if (result.error) {
          toast.error(result.error);
        } else {
          // Verify admin status server-side (bypasses RLS issues)
          const verifyRes = await fetch("/api/admin/verify", { method: "POST" });
          const verifyData = await verifyRes.json();

          if (!verifyRes.ok) {
            toast.error(verifyData.error || "Verification failed");
            await signOut();
            setLoading(false);
            return;
          }

          if (!verifyData.verified) {
            toast.error("Access denied. Admin privileges required.");
            await signOut();
            setLoading(false);
            return;
          }

          toast.success("Welcome back, Admin!");
          router.push("/admin");
          router.refresh();
        }
      } else if (mode === "signin") {
        const result = await signIn(email, password);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Signed in successfully!");
          const supabaseModule = await import("@/lib/supabase/client");
          const supabase = supabaseModule.createClient();
          if (!supabase || !supabase.auth) {
            router.push(redirectTo);
            return;
          }
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("role, status")
              .eq("id", authUser.id)
              .single();
            if (profile && (profile.role === "vendor" || profile.role === "wholesaler") && profile.status === "pending") {
              toast.error("Your account is pending admin approval. Please wait.");
              setLoading(false);
              return;
            }
            router.push(getRoleRedirect(profile?.role));
          } else {
            router.push(redirectTo);
          }
        }
      } else {
        const result = await signUp(email, password, fullName, accountType);
        if (result.error) {
          toast.error(result.error);
        } else {
          const msg = accountType === "customer"
            ? "Account created! Check your email for verification."
            : "Registration submitted! Admin will review and approve your account.";
          toast.success(msg);
          if (result.user) {
            const supabaseModule = await import("@/lib/supabase/client");
            const supabase = supabaseModule.createClient();
            if (supabase && supabase.auth) {
              const { data: profile } = await supabase
                .from("profiles")
                .select("role, status")
                .eq("id", result.user.id)
                .single();
              if (profile && (profile.role === "vendor" || profile.role === "wholesaler") && profile.status === "pending") {
                toast.success("Registration submitted! Admin will review and approve your account.");
              } else {
                router.push(getRoleRedirect(profile?.role));
              }
            }
          }
        }
      }
    } catch {
      toast.error("An error occurred");
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    const origin = window.location.origin;
    const redirectUrl = `${origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`;
    await signInWithGoogle(redirectUrl);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-serif text-2xl font-bold tracking-tight text-foreground">ECOM</span>
          </Link>
        </div>

        <div className="card p-8">
          <div className="flex bg-muted rounded-lg p-1 mb-6">
            {(["customer", "admin"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setLoginType(type)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  loginType === type
                    ? "bg-white text-foreground shadow-sm"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                {type === "customer" ? (
                  <><User className="w-3.5 h-3.5" /> Customer</>
                ) : (
                  <><Shield className="w-3.5 h-3.5" /> Admin</>
                )}
              </button>
            ))}
          </div>

          {loginType === "customer" ? (
            <>
              <div className="flex bg-muted rounded-lg p-1 mb-6">
                {(["signin", "signup"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setMode(tab)}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
                      mode === tab
                        ? "bg-white text-foreground shadow-sm"
                        : "text-foreground-secondary hover:text-foreground"
                    }`}
                  >
                    {tab === "signin" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>

              <div className="mb-6 grid grid-cols-3 gap-2">
                {[
                  { key: "customer", label: "Customer", icon: User },
                  { key: "vendor", label: "Vendor", icon: Store },
                  { key: "wholesaler", label: "Wholesaler", icon: Building2 },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setAccountType(option.key as "customer" | "vendor" | "wholesaler")}
                      className={`rounded-lg border px-2 py-3 text-xs font-medium transition-all ${
                        accountType === option.key
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-foreground-secondary hover:bg-muted"
                      }`}
                    >
                      <Icon className="mx-auto mb-1 h-4 w-4" />
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {mode === "signup" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        label="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        leftIcon={<User className="w-4 h-4" />}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  leftIcon={<Mail className="w-4 h-4" />}
                />

                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />

                <Button type="submit" className="w-full shimmer-btn" size="lg" loading={loading}>
                  {mode === "signin" ? "Sign In" : "Create Account"}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-foreground-secondary">or</span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                className="w-full h-12 flex items-center justify-center gap-3 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              <p className="text-center text-xs text-foreground-secondary mt-6">
                By continuing, you agree to our{" "}
                <Link href="/policies/terms" className="text-foreground hover:underline">Terms</Link>
                {" "}and{" "}
                <Link href="/policies/privacy" className="text-foreground hover:underline">Privacy Policy</Link>
              </p>
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  leftIcon={<Mail className="w-4 h-4" />}
                  placeholder="admin@example.com"
                />

                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />

                <Button type="submit" className="w-full shimmer-btn" size="lg" loading={loading}>
                  Sign In as Admin
                </Button>
              </form>

              <p className="text-center text-xs text-foreground-secondary mt-6">
                <button
                  onClick={() => setLoginType("customer")}
                  className="text-foreground hover:underline"
                >
                  ← Back to customer login
                </button>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
