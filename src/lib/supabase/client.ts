import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (typeof window === "undefined") {
      return null as any;
    }
    console.warn("Supabase env vars not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
    return null as any;
  }

  if (!client) {
    client = createBrowserClient(url, key);
  }
  return client;
}

export function createSafeClient() {
  try {
    return createClient();
  } catch (error) {
    console.error("Failed to initialize Supabase client", error);
    return null as any;
  }
}
