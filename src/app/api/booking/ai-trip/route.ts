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
    const body = await req.json();
    const { itinerary, customerName, email, phone, travelDate, travelers, notes } = body;

    if (!itinerary || !customerName || !email || !phone || !travelDate || !travelers) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const newBooking = {
      _type: "booking",
      customerName,
      email,
      phone,
      travelDate,
      travelers: Number(travelers),
      totalPrice: 0,
      notes: `[AI-Generated Trip]\nTitle: ${itinerary.title}\nDestination: ${itinerary.destination}\nDuration: ${itinerary.duration}\nBudget: ${itinerary.budget}\nEstimated Cost: ${itinerary.estimatedCostPerPerson}/person\n\n${notes || ""}\n\nFull Itinerary:\n${itinerary.days?.map((d: any) => `Day ${d.day}: ${d.title} - ${d.location}\n${d.activities?.map((a: any) => `  ${a.time}: ${a.activity}`).join("\n")}`).join("\n\n") || "See AI-generated plan"}`,
      status: "Pending",
    };

    const result = await writeClient.create(newBooking);

    return NextResponse.json({ success: true, bookingId: result._id }, { status: 201 });
  } catch (error: any) {
    console.error("AI Booking error:", error);
    return NextResponse.json({ success: false, message: "Failed to submit booking" }, { status: 500 });
  }
}
