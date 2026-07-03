import { createServerClient } from "@supabase/ssr";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      return NextResponse.json({ verified: false, error: "Server config incomplete" }, { status: 500 });
    }

    // Read session from cookies to get the authenticated user
    const serverClient = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() { return req.cookies.getAll(); },
        setAll() {},
      },
    });

    const { data: { user } } = await serverClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ verified: false, error: "Not authenticated" }, { status: 401 });
    }

    // Use service role client to query profile (bypasses RLS)
    const serviceClient = createServiceClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { data: profile } = await serviceClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ verified: false, error: "Profile not found", userId: user.id });
    }

    const isAdmin = profile.role === "admin" || profile.role === "super_admin";

    return NextResponse.json({
      verified: isAdmin,
      role: profile.role,
      userId: user.id,
      email: user.email,
    });
  } catch (err) {
    return NextResponse.json({ verified: false, error: String(err) }, { status: 500 });
  }
}
