import { NextRequest, NextResponse } from "next/server";

import { draftProjectBrief, isBriefAssistantEnabled } from "@/lib/ai";
import { briefAssistInputSchema } from "@/lib/ai/types";
import { getRateLimiter } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isBriefAssistantEnabled()) {
    return NextResponse.json(
      { error: "Brief assistant is disabled." },
      { status: 403 },
    );
  }

  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = briefAssistInputSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 },
    );
  }

  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({
      message:
        "I'm reaching out about a project and would like to book a short scoping call.",
      suggestedService: null,
      suggestedBudget: null,
    });
  }

  const limiter = getRateLimiter();
  const rateLimit = await limiter.limit(`ai-brief:${getClientIp(request)}`);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 },
    );
  }

  try {
    const output = await draftProjectBrief(parsed.data);
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Brief failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
