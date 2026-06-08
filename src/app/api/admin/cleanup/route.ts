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

    // 1. Move old Completed/Cancelled leads to Trash (after 7 days of inactivity)
    const oldLeadsQuery = `*[_type == "booking" && status in ["Completed", "Cancelled"] && isTrashed != true] {
      _id,
      _updatedAt
    }`;
    const oldLeads = await authenticatedClient.fetch(oldLeadsQuery);
    const now = new Date();
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    let trashedCount = 0;

    for (const lead of oldLeads) {
      const updatedAt = new Date(lead._updatedAt);
      if (now.getTime() - updatedAt.getTime() > SEVEN_DAYS_MS) {
        await authenticatedClient.patch(lead._id).set({ isTrashed: true, trashedAt: now.toISOString() }).commit();
        trashedCount++;
      }
    }

    // 2. Permanently delete items that have been in Trash for > 30 days
    const trashQuery = `*[isTrashed == true] {
      _id,
      trashedAt
    }`;
    const trashedItems = await authenticatedClient.fetch(trashQuery);
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    let deletedCount = 0;

    for (const item of trashedItems) {
      if (item.trashedAt) {
        const trashedAtDate = new Date(item.trashedAt);
        if (now.getTime() - trashedAtDate.getTime() > THIRTY_DAYS_MS) {
          await authenticatedClient.delete(item._id);
          deletedCount++;
        }
      }
    }

    return NextResponse.json({ success: true, trashedCount, deletedCount });
  } catch (error: any) {
    console.error("Failed to run CRM cleanup:", error);
    return NextResponse.json({ error: "Cleanup failed", details: error.message }, { status: 500 });
  }
}
