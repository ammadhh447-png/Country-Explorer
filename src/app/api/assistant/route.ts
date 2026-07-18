import { NextResponse } from "next/server";
import { loadCountries } from "@/lib/api/countries-data";
import { toCountrySummary } from "@/lib/api/countries";
import {
  buildAssistantReply,
  parseIntentLocally,
  type ParsedIntent,
  type AssistantIntent,
} from "@/lib/api/assistant-engine";

export const dynamic = "force-dynamic";

const VALID_INTENTS: AssistantIntent[] = [
  "compare",
  "profile",
  "population_rank",
  "area_rank",
  "smallest",
  "languages",
  "region",
  "currency",
  "help",
];

const SYSTEM_PROMPT = `You classify country-related questions. Return ONLY JSON:
{"intent":"compare|profile|population_rank|area_rank|smallest|languages|region|currency|help","countries":["standard English country names"],"region":"Europe|Asia|Africa|Americas|Oceania|null"}
Rules:
- Use standard English names (South Korea not Korea, United States not USA).
- Never invent countries or facts.
- For compare questions, list exactly the two countries.
- For region questions, set region and leave countries empty.
- If unsure, use intent "help".`;

function getLlmConfig():
  | { provider: "openrouter"; apiKey: string; model: string; url: string }
  | { provider: "openai"; apiKey: string; model: string; url: string }
  | null {
  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();
  if (openRouterKey) {
    return {
      provider: "openrouter",
      apiKey: openRouterKey,
      model: process.env.OPENROUTER_MODEL?.trim() || "openai/gpt-4o-mini",
      url: "https://openrouter.ai/api/v1/chat/completions",
    };
  }

  const openAiKey = process.env.OPENAI_API_KEY?.trim();
  if (openAiKey) {
    return {
      provider: "openai",
      apiKey: openAiKey,
      model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
      url: "https://api.openai.com/v1/chat/completions",
    };
  }

  return null;
}

async function parseQueryWithLLM(query: string): Promise<ParsedIntent | null> {
  const config = getLlmConfig();
  if (!config) return null;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${config.apiKey}`,
    "Content-Type": "application/json",
  };

  if (config.provider === "openrouter") {
    headers["HTTP-Referer"] =
      process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
    headers["X-Title"] = "Country Explorer";
  }

  try {
    const res = await fetch(config.url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: config.model,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: query },
        ],
      }),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content) as {
      intent?: string;
      countries?: string[];
      region?: string | null;
    };

    const intent = VALID_INTENTS.includes(parsed.intent as AssistantIntent)
      ? (parsed.intent as AssistantIntent)
      : "help";

    return {
      intent,
      countries: Array.isArray(parsed.countries)
        ? parsed.countries.filter((c) => typeof c === "string" && c.trim())
        : undefined,
      region: parsed.region && parsed.region !== "null" ? parsed.region : undefined,
    };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { query?: string };
    const query = body.query?.trim();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const countries = (await loadCountries()).map(toCountrySummary);
    const llmIntent = await parseQueryWithLLM(query);
    const parsed = llmIntent ?? parseIntentLocally(query, countries);
    const reply = buildAssistantReply(
      query,
      countries,
      parsed,
      llmIntent ? "llm+data" : "data"
    );

    return NextResponse.json(reply);
  } catch {
    return NextResponse.json({ error: "Failed to process query" }, { status: 500 });
  }
}
