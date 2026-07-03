import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_MODEL = "openai/gpt-4o";

let cachedRuntimeSettings: { apiKey: string | null; model: string | null } | null = null;

async function getRuntimeSettings() {
  if (cachedRuntimeSettings) return cachedRuntimeSettings;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("openrouter_api_key, openrouter_model").eq("id", "1").single();
    if (data) {
      cachedRuntimeSettings = {
        apiKey: data.openrouter_api_key || null,
        model: data.openrouter_model || null,
      };
    }
  } catch {
    // Runtime settings unavailable
  }
  return cachedRuntimeSettings || { apiKey: null, model: null };
}

export function clearRuntimeCache() {
  cachedRuntimeSettings = null;
}

export async function getOpenRouter() {
  const envApiKey = process.env.OPENROUTER_API_KEY;
  if (envApiKey && envApiKey !== "your_openrouter_api_key") {
    return createOpenRouter({ apiKey: envApiKey });
  }
  const runtime = await getRuntimeSettings();
  if (runtime.apiKey && runtime.apiKey !== "your_openrouter_api_key") {
    return createOpenRouter({ apiKey: runtime.apiKey });
  }
  return null;
}

export async function getModel() {
  const envModel = process.env.OPENROUTER_MODEL;
  if (envModel) return envModel;
  const runtime = await getRuntimeSettings();
  return runtime.model || DEFAULT_MODEL;
}

export function aiNotConfiguredResponse() {
  return new Response(
    JSON.stringify({
      error: "AI is not configured. Please set OPENROUTER_API_KEY in your .env file or configure it in Admin \u2192 Settings \u2192 AI. Get a key at https://openrouter.ai/keys",
    }),
    { status: 503, headers: { "Content-Type": "application/json" } }
  );
}
