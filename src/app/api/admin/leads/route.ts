import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export async function GET() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("roodhways_admin_authenticated")?.value === "true";

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const writeToken = process.env.SANITY_API_WRITE_TOKEN;

  try {
    const authenticatedClient = createClient({
      projectId,
      dataset,
      apiVersion,
      token: writeToken,
      useCdn: false,
    });

    const query = `*[_type == "booking" && isTrashed != true] | order(_createdAt desc) {
      _id,
      customerName,
      email,
      phone,
      travelDate,
      durationDays,
      travelers,
      status,
      totalPrice,
      advancePaid,
      vendorCosts,
      costItems,
      markupPercentage,
      taxPercentage,
      paymentLog,
      notes,
      agentNotes,
      _createdAt
    }`;

    const data = await authenticatedClient.fetch(query);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to load leads", details: error.message }, { status: 500 });
  }
}
