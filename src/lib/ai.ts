import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o";

export function getOpenRouter() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === "your_openrouter_api_key") {
    return null;
  }
  return createOpenRouter({ apiKey });
}

export function getModel() {
  return MODEL;
}

export function aiNotConfiguredResponse() {
  return new Response(
    JSON.stringify({
      error: "AI is not configured. Please set OPENROUTER_API_KEY in your .env file. Get a key at https://openrouter.ai/keys",
    }),
    { status: 503, headers: { "Content-Type": "application/json" } }
  );
}
