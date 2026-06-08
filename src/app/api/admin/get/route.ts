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
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing document id parameter" }, { status: 400 });
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

    // GROQ query to retrieve document by ID
    const query = `*[_id == $id][0]`;
    const doc = await authenticatedClient.fetch(query, { id });

    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 444 });
    }

    return NextResponse.json(doc);
  } catch (error: any) {
    console.error(`Failed to fetch document ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to load document", details: error.message },
      { status: 500 }
    );
  }
}
