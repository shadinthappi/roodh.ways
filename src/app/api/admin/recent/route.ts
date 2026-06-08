import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export async function GET() {
  // Authentication check
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("roodhways_admin_authenticated")?.value === "true";

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch write token for authenticated reading (drafts)
  const writeToken = process.env.SANITY_API_WRITE_TOKEN;

  try {
    // Instantiate authenticated client
    const authenticatedClient = createClient({
      projectId,
      dataset,
      apiVersion,
      token: writeToken,
      useCdn: false,
    });

    const recentQuery = `*[_type in ["destination", "experience", "route", "itinerary", "story", "event"]] | order(_updatedAt desc)[0...15] {
      _id,
      _type,
      _updatedAt,
      title,
      name,
      slug
    }`;

    const data = await authenticatedClient.fetch(recentQuery);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Failed to query recent documents from Sanity:", error);
    return NextResponse.json(
      { error: "Failed to load recent updates", details: error.message },
      { status: 500 }
    );
  }
}
