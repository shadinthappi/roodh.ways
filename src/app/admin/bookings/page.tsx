import React from "react";
import { groq } from "next-sanity";
import { sanityFetch } from "@/sanity/client";

import BookingStatusSelect from "./BookingStatusSelect";
import AddBookingModal from "./AddBookingModal";

export const revalidate = 0; // Don't cache admin pages

export default async function AdminBookingsPage() {
  const query = groq`*[_type == "booking"] | order(_createdAt desc) {
    _id,
    customerName,
    email,
    phone,
    travelDate,
    travelers,
    status,
    totalPrice,
    _createdAt,
    itinerary->{
      title
    }
  }`;

  const itinerariesQuery = groq`*[_type == "itinerary"] | order(title asc) { _id, title }`;

  const [bookings, itineraries] = await Promise.all([
    sanityFetch<any[]>(query),
    sanityFetch<any[]>(itinerariesQuery),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading font-black uppercase text-brand-dark">Booking Requests</h2>
          <p className="text-sm font-sans text-brand-dark/60 mt-1">Manage and track your leads.</p>
        </div>
        <AddBookingModal itineraries={itineraries} />
      </div>

      <div className="bg-brand-white rounded-2xl shadow-sm border border-brand-dark/10 overflow-hidden">
        {bookings.length === 0 ? (
          <div className="p-12 text-center text-brand-dark/50 font-sans">
            No bookings found yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-sm">
              <thead className="bg-brand-offwhite text-brand-dark/60 font-bold uppercase tracking-wider text-[10px] border-b border-brand-dark/10">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Itinerary</th>
                  <th className="px-6 py-4">Travel Date</th>
                  <th className="px-6 py-4 text-right">Value (₹)</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-dark/5">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-brand-offwhite/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-brand-dark">{booking.customerName}</div>
                      <div className="text-xs text-brand-dark/60 mt-0.5">{booking.email}</div>
                      <div className="text-xs text-brand-dark/60">{booking.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-brand-dark">{booking.itinerary?.title || "Unknown Itinerary"}</div>
                      <div className="text-xs text-brand-dark/60 mt-0.5">{booking.travelers} Traveler(s)</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-brand-dark/80">
                      {new Date(booking.travelDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-brand-dark">
                      {booking.totalPrice?.toLocaleString() || "0"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <BookingStatusSelect bookingId={booking._id} initialStatus={booking.status} />
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-brand-dark/60">
                      {new Date(booking._createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
