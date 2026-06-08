import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export async function GET(request: Request) {
  // Authentication check
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("roodhways_admin_authenticated")?.value === "true";

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (!type) {
    return NextResponse.json({ error: "Missing document type parameter" }, { status: 400 });
  }

  // Permitted types list for safety
  const permittedTypes = ["destination", "experience", "route", "itinerary", "story", "event", "internationalTrip", "product"];
  if (!permittedTypes.includes(type)) {
    return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
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

    // GROQ query to list all documents of specific type
    const query = `*[_type == $type] | order(_updatedAt desc) {
      _id,
      _type,
      _updatedAt,
      title,
      name,
      slug
    }`;

    const data = await authenticatedClient.fetch(query, { type });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`Failed to list documents of type ${type}:`, error);
    return NextResponse.json(
      { error: "Failed to list documents", details: error.message },
      { status: 500 }
    );
  }
}
