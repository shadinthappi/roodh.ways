import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { eventType, path } = await req.json();

    if (!eventType || !path) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    // Ignore admin routes
    if (path.startsWith("/admin") || path.startsWith("/studio")) {
      return NextResponse.json({ success: true, ignored: true });
    }

    // Fire and forget
    writeClient.create({
      _type: "analyticsEvent",
      eventType,
      path,
    }).catch((err) => console.error("Failed to log analytics:", err));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
