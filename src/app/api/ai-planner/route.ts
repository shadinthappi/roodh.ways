import { NextResponse } from "next/server";
import { createClient, groq } from "next-sanity";
import { sanityFetch } from "@/sanity/client";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are an expert travel planner for "Roodh.ways", a premium Indian travel company that organises both domestic (India) and international trips.

When a user describes their ideal trip, generate a complete, detailed day-by-day travel itinerary.

You MUST respond with valid JSON only — no markdown, no code fences, no explanation text. Just the raw JSON object.

The JSON must follow this exact structure:
{
  "title": "A catchy trip title",
  "destination": "Primary destination name",
  "duration": "X Days / Y Nights",
  "budget": "Budget-Friendly | Mid-Range | Luxury | Premium",
  "estimatedCostPerPerson": "₹XX,XXX or $X,XXX",
  "bestTimeToVisit": "Month - Month",
  "overview": "2-3 sentence trip overview",
  "highlights": ["highlight 1", "highlight 2", "highlight 3", "highlight 4", "highlight 5"],
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "location": "City/Place",
      "activities": [
        { "time": "Morning", "activity": "Description of activity", "tip": "Optional insider tip" },
        { "time": "Afternoon", "activity": "Description", "tip": "" },
        { "time": "Evening", "activity": "Description", "tip": "" }
      ],
      "accommodation": "Suggested stay type",
      "meals": "Breakfast, Lunch, Dinner recommendations"
    }
  ],
  "packingTips": ["tip 1", "tip 2", "tip 3", "tip 4", "tip 5"],
  "travelNotes": "Any visa, currency, safety, or cultural notes relevant to the destination"
}

Rules:
- Be specific with place names, restaurant types, and activity descriptions.
- For Indian destinations, use ₹ (INR) for costs. For international, use local currency and also mention INR equivalent.
- Include realistic travel times between locations.
- Add local food recommendations for each day.
- Make the itinerary feel personal and exciting, not generic.
- Each day should have 3 activity slots: Morning, Afternoon, Evening.
- Provide 5-7 days of itinerary unless the user specifies otherwise.
- Always include packing tips relevant to the destination and season.`;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || prompt.trim().length < 10) {
      return NextResponse.json(
        { success: false, message: "Please describe your trip in more detail." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "AI service not configured." },
        { status: 500 }
      );
    }

    let knowledgeBase = "";
    try {
      const logs = await sanityFetch<any[]>(
        groq`*[_type == "aiLog" && isApprovedKnowledge == true && feature == "Trip Planner"] | order(_createdAt desc) [0...3] { prompt, response }`
      );
      if (logs && logs.length > 0) {
         knowledgeBase = "\n\n--- APPROVED KNOWLEDGE BASE (Past successful JSON examples) ---\n" + logs.map((log, i) => `Example ${i + 1}:\nUser Prompt: ${log.prompt}\nValid JSON Output: ${log.response}`).join("\n\n");
      }
    } catch (err) {
      console.warn("Failed to fetch ai itinerary knowledge", err);
    }

    const finalSystemPrompt = SYSTEM_PROMPT + knowledgeBase;

    // Retry logic for rate limits (429)
    let lastError = "";
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) {
        await new Promise((resolve) => setTimeout(resolve, attempt === 1 ? 3000 : 8000));
      }

      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: finalSystemPrompt },
            { role: "user", content: prompt },
          ],
          temperature: 0.85,
          max_tokens: 4096,
          response_format: { type: "json_object" },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.choices?.[0]?.message?.content;

        if (!rawText) {
          return NextResponse.json(
            { success: false, message: "No response from AI. Please try again." },
            { status: 502 }
          );
        }

        const itinerary = JSON.parse(rawText);

        // BACKGROUND LOGGING
        const writeClient = createClient({
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
          apiVersion: "2024-01-01",
          useCdn: false,
          token: process.env.SANITY_API_WRITE_TOKEN,
        });
        
        writeClient.create({
          _type: "aiLog",
          feature: "Trip Planner",
          prompt: prompt,
          response: rawText,
          isApprovedKnowledge: false
        }).catch(err => console.error("Failed to log AI planner interaction:", err));

        return NextResponse.json({ success: true, itinerary }, { status: 200 });
      }

      if (response.status === 429) {
        console.warn(`Groq rate limited (attempt ${attempt + 1}/3), retrying...`);
        lastError = "rate_limit";
        continue;
      }

      // Non-retryable error
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      return NextResponse.json(
        { success: false, message: "AI generation failed. Please try again." },
        { status: 502 }
      );
    }

    // All retries exhausted
    if (lastError === "rate_limit") {
      return NextResponse.json(
        { success: false, message: "The AI service is busy right now. Please wait 30 seconds and try again." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { success: false, message: "AI generation failed after multiple attempts." },
      { status: 502 }
    );
  } catch (error: any) {
    console.error("AI Planner error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
