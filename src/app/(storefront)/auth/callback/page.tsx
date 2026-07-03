"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        if (!supabase || !supabase.auth) {
          router.push("/auth");
          return;
        }
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Try to create/ensure profile exists for OAuth users
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();
          if (!profile) {
            await supabase.from("profiles").upsert({
              id: session.user.id,
              email: session.user.email || "",
              full_name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
              role: "customer",
              status: "approved",
            }, { onConflict: "id" });
          }
          const role = profile?.role || "customer";
          const redirects: Record<string, string> = {
            admin: "/admin", super_admin: "/admin",
            vendor: "/vendor", wholesaler: "/wholesaler",
          };
          router.push(redirects[role] || "/account");
        } else {
          router.push("/auth");
        }
      } catch {
        router.push("/auth");
      }
    })();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );
}
