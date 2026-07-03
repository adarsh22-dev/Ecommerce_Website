"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role, status")
            .eq("id", session.user.id)
            .single();

          if (profileError && profileError.code === "PGRST116") {
            // Profile doesn't exist, create it
            await supabase.from("profiles").insert({
              id: session.user.id,
              email: session.user.email || "",
              full_name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
              role: "customer",
              status: "approved",
            });
          }

          // Get the updated profile to check role
          const { data: updatedProfile } = await supabase
            .from("profiles")
            .select("role, status")
            .eq("id", session.user.id)
            .single();

          // Check for redirect parameter
          const redirectTo = searchParams.get("redirect");
          const role = updatedProfile?.role || "customer";
          const status = updatedProfile?.status || "approved";

          // Handle pending vendor/wholesaler
          if ((role === "vendor" || role === "wholesaler") && status === "pending") {
            router.push("/auth?error=pending_approval");
            return;
          }

          const redirects: Record<string, string> = {
            admin: "/admin", super_admin: "/admin",
            vendor: "/vendor", wholesaler: "/wholesaler",
          };

          // Use redirect parameter if provided, otherwise use role-based redirect
          if (redirectTo) {
            router.push(redirectTo);
          } else {
            router.push(redirects[role] || "/account");
          }
        } else {
          router.push("/auth");
        }
      } catch {
        router.push("/auth");
      }
    })();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );
}
