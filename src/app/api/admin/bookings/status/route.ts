import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function PATCH(req: Request) {
  try {
    // Basic auth check using cookies
    const authCookie = req.headers.get("cookie")?.includes("roodhways_admin_authenticated=true");
    if (!authCookie) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { bookingId, status } = await req.json();

    if (!bookingId || !status) {
      return NextResponse.json({ success: false, message: "Missing data" }, { status: 400 });
    }

    const validStatuses = ["Pending", "Contacted", "Confirmed", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
    }

    await writeClient.patch(bookingId).set({ status }).commit();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Status update error:", error);
    return NextResponse.json({ success: false, message: "Failed to update status" }, { status: 500 });
  }
}
