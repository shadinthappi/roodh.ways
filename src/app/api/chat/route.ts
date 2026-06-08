import { NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/client";
import { groq, createClient } from "next-sanity";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const DEFAULT_SYSTEM_PROMPT = `You are the friendly travel assistant for "Roodh.ways", a premium Indian travel company offering domestic (India) and international trips.

Your role:
- Answer questions about Indian destinations, culture, food, weather, visa requirements, packing tips, and travel advice.
- Suggest destinations and experiences based on what the user is looking for.
- Keep answers concise (2–4 sentences) and conversational — you are chatting, not writing an essay.
- If someone asks to book a trip or plan one in detail, tell them to check out our "Plan A Trip" page at /plan for the full AI itinerary builder.
- Be warm, enthusiastic, and knowledgeable. Use emojis sparingly (1-2 max per message).
- If you don't know something, say so honestly rather than making things up.
- You can mention specific Roodh.ways pages like Destinations, Experiences, International Trips, and The Kit when relevant.

IMPORTANT RULE FOR LEAD COLLECTION:
When you need to collect the user's booking details (name, email/phone, dates, destination, travelers), do NOT ask them to type it out. 
Instead, reply EXACTLY with the text \`[SHOW_LEAD_FORM]\` and nothing else. This will automatically show a secure form on their screen.
Once they submit the form, the system will send you a message confirming it, and ONLY THEN should you reply with your final sign-off (e.g. "Thanks! Our team will get in touch with you soon...").

Never respond with markdown formatting (no bold, headers, or bullet lists). Keep it plain conversational text.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, message: "No messages provided." },
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

    // Fetch custom system prompt and Approved Knowledge from Sanity
    let systemPrompt = DEFAULT_SYSTEM_PROMPT;
    let knowledgeBase = "";
    
    try {
      const [settings, logs] = await Promise.all([
        sanityFetch<any>(groq`*[_type == "siteSettings"][0] { chatbotSystemPrompt, chatbotEnabled }`),
        sanityFetch<any[]>(groq`*[_type == "aiLog" && isApprovedKnowledge == true && feature == "Chatbot"] | order(_createdAt desc) [0...5] { prompt, response }`)
      ]);
      
      if (settings?.chatbotEnabled === false) {
        return NextResponse.json(
          { success: false, message: "Chat is currently disabled." },
          { status: 503 }
        );
      }
      
      if (settings?.chatbotSystemPrompt?.trim()) {
        systemPrompt = settings.chatbotSystemPrompt + `\n\nIMPORTANT RULE FOR LEAD COLLECTION:\nWhen you need to collect the user's booking details, do NOT ask them to type it out. Instead, reply EXACTLY with the text \`[SHOW_LEAD_FORM]\` and nothing else. Once they submit the form, the system will send you a confirmation message, and ONLY THEN should you reply with your final sign-off.`;
      }

      if (logs && logs.length > 0) {
        knowledgeBase = "\n\n--- APPROVED KNOWLEDGE BASE (Past Examples) ---\n" + logs.map((log, i) => `Example ${i + 1}:\nUser: ${log.prompt}\nAI: ${log.response}`).join("\n\n");
      }
    } catch (err) {
      console.warn("Failed to fetch settings/knowledge", err);
    }

    const finalSystemPrompt = systemPrompt + knowledgeBase;

    // Convert messages to OpenAI-compatible format
    const chatMessages = [
      { role: "system" as const, content: finalSystemPrompt },
      ...messages.map((msg: { role: string; text: string }) => ({
        role: (msg.role === "user" ? "user" : "assistant") as "user" | "assistant",
        content: msg.text,
      })),
    ];

    // Retry logic for rate limits
    let lastError = "";
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) {
        await new Promise((resolve) => setTimeout(resolve, attempt === 1 ? 2000 : 5000));
      }

      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: chatMessages,
          temperature: 0.8,
          max_tokens: 512,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data?.choices?.[0]?.message?.content;

        if (!reply) {
          return NextResponse.json({ success: false, message: "No response from AI." }, { status: 502 });
        }

        // BACKGROUND LOGGING
        // Extract the last user message to log what prompted this response
        const lastUserMsg = [...messages].reverse().find(m => m.role === "user")?.text;
        if (lastUserMsg && !reply.includes("[SHOW_LEAD_FORM]")) {
          // Log asynchronously
          const writeClient = createClient({
            projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
            dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
            apiVersion: "2024-01-01",
            useCdn: false,
            token: process.env.SANITY_API_WRITE_TOKEN,
          });
          
          writeClient.create({
            _type: "aiLog",
            feature: "Chatbot",
            prompt: lastUserMsg,
            response: reply,
            isApprovedKnowledge: false
          }).catch(err => console.error("Failed to log AI chat interaction:", err));
        }

        return NextResponse.json({ success: true, reply }, { status: 200 });
      }

      if (response.status === 429) {
        lastError = "rate_limit";
        continue;
      }

      const errorText = await response.text();
      console.error("Groq Chat API error:", response.status, errorText);
      return NextResponse.json({ success: false, message: "AI generation failed." }, { status: 502 });
    }

    if (lastError === "rate_limit") {
      return NextResponse.json({ success: false, message: "The AI is busy right now. Please try again." }, { status: 429 });
    }

    return NextResponse.json({ success: false, message: "AI generation failed after multiple attempts." }, { status: 502 });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 500 });
  }
}
