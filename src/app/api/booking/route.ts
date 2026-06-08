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
    const { itineraryId, customerName, email, phone, travelDate, travelers, notes, totalPrice } = body;

    if (!itineraryId || !customerName || !email || !phone || !travelDate || !travelers) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const newBooking = {
      _type: "booking",
      itinerary: {
        _type: "reference",
        _ref: itineraryId,
      },
      customerName,
      email,
      phone,
      travelDate,
      travelers: Number(travelers),
      totalPrice: Number(totalPrice) || 0,
      notes: notes || "",
      status: "Pending",
    };

    const result = await writeClient.create(newBooking);

    return NextResponse.json({ success: true, bookingId: result._id }, { status: 201 });
  } catch (error: any) {
    console.error("Booking submission error:", error);
    return NextResponse.json({ success: false, message: "Failed to submit booking" }, { status: 500 });
  }
}
