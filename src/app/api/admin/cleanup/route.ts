import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export async function POST() {
  const writeToken = process.env.SANITY_API_WRITE_TOKEN;

  if (!writeToken) {
    return NextResponse.json({ error: "No write token configured" }, { status: 500 });
  }

  try {
    const authenticatedClient = createClient({
      projectId,
      dataset,
      apiVersion,
      token: writeToken,
      useCdn: false,
    });

    // Find bookings that are Completed or Cancelled
    const query = `*[_type == "booking" && status in ["Completed", "Cancelled"]] {
      _id,
      _updatedAt
    }`;

    const oldLeads = await authenticatedClient.fetch(query);
    
    const now = new Date();
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    
    let deletedCount = 0;

    for (const lead of oldLeads) {
      const updatedAt = new Date(lead._updatedAt);
      if (now.getTime() - updatedAt.getTime() > SEVEN_DAYS_MS) {
        await authenticatedClient.delete(lead._id);
        deletedCount++;
      }
    }

    return NextResponse.json({ success: true, deletedCount });
  } catch (error: any) {
    console.error("Failed to run CRM cleanup:", error);
    return NextResponse.json({ error: "Cleanup failed", details: error.message }, { status: 500 });
  }
}
