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

    const statsQuery = `{
      "destinations": count(*[_type == "destination"]),
      "experiences": count(*[_type == "experience"]),
      "routes": count(*[_type == "route"]),
      "itineraries": count(*[_type == "itinerary"]),
      "internationalTrips": count(*[_type == "internationalTrip"]),
      "products": count(*[_type == "product"]),
      "stories": count(*[_type == "story"]),
      "events": count(*[_type == "event"]),
      "pageviews": count(*[_type == "analyticsEvent" && eventType == "pageview"]),
      "explores": count(*[_type == "analyticsEvent" && eventType == "explore"]),
      "leads": count(*[_type == "booking"])
    }`;

    const data = await authenticatedClient.fetch(statsQuery);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Failed to query stats from Sanity:", error);
    return NextResponse.json(
      { error: "Failed to load database stats", details: error.message },
      { status: 500 }
    );
  }
}
