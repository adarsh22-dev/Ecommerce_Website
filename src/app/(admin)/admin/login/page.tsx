"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/contexts/auth-context";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn(email, password);
      if (result.error) {
        toast.error(result.error);
      } else {
        const supabaseModule = await import("@/lib/supabase/client");
        const supabase = supabaseModule.createClient();
        if (!supabase || !supabase.auth) {
          toast.error("Authentication service unavailable");
          setLoading(false);
          return;
        }
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role, status")
            .eq("id", authUser.id)
            .single();
          if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
            toast.error("Access denied. Admin privileges required.");
            await supabase.auth.signOut();
            setLoading(false);
            return;
          }
          toast.success("Welcome back, Admin!");
          router.push("/admin");
          router.refresh();
        } else {
          toast.error("Authentication failed");
        }
      }
    } catch {
      toast.error("An error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/admin" className="inline-block">
            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Admin Sign In</h1>
          <p className="text-foreground-secondary mt-2">Secure access to admin panel</p>
        </div>

        <div className="card p-8">
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
              Sign In
            </Button>
          </form>

          <p className="text-center text-xs text-foreground-secondary mt-6">
            <Link href="/auth" className="text-foreground hover:underline">
              ← Customer / Vendor login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}