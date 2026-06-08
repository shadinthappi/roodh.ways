"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface BookingFormProps {
  itineraryId: string;
  itineraryTitle: string;
  priceFrom: number;
}

export default function BookingForm({ itineraryId, itineraryTitle, priceFrom }: BookingFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    travelDate: "",
    travelers: 1,
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const totalPrice = priceFrom * formData.travelers;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itineraryId,
          ...formData,
          totalPrice,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit booking");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-2xl text-center shadow-sm">
        <h2 className="font-heading text-3xl font-black uppercase mb-4">Booking Request Sent!</h2>
        <p className="font-sans text-lg mb-8">
          Thank you, {formData.customerName}. We have received your booking request for {itineraryTitle}. Our team will contact you shortly to confirm the details.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-green-600 hover:bg-green-700 text-white font-bold uppercase tracking-widest px-8 py-3 rounded-xl transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Full Name *</label>
          <input
            type="text"
            name="customerName"
            required
            value={formData.customerName}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-brand-white border border-brand-dark/10 rounded-xl text-brand-dark focus:outline-none focus:border-brand-blue transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Email Address *</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-brand-white border border-brand-dark/10 rounded-xl text-brand-dark focus:outline-none focus:border-brand-blue transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-brand-white border border-brand-dark/10 rounded-xl text-brand-dark focus:outline-none focus:border-brand-blue transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Intended Travel Date *</label>
          <input
            type="date"
            name="travelDate"
            required
            value={formData.travelDate}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-brand-white border border-brand-dark/10 rounded-xl text-brand-dark focus:outline-none focus:border-brand-blue transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Number of Travelers *</label>
        <input
          type="number"
          name="travelers"
          min="1"
          required
          value={formData.travelers}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-brand-white border border-brand-dark/10 rounded-xl text-brand-dark focus:outline-none focus:border-brand-blue transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Special Requests / Notes</label>
        <textarea
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-brand-white border border-brand-dark/10 rounded-xl text-brand-dark focus:outline-none focus:border-brand-blue transition-colors"
          placeholder="Any dietary requirements, accessibility needs, etc."
        />
      </div>

      <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-2xl p-6 flex items-center justify-between mt-8">
        <div>
          <p className="text-xs font-black text-brand-blue uppercase tracking-wider mb-1">Estimated Total</p>
          <p className="font-heading font-black text-3xl text-brand-dark">₹{totalPrice.toLocaleString()}</p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand-blue hover:bg-brand-blue/80 text-brand-white px-8 py-4 rounded-xl font-heading uppercase tracking-wider font-bold transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
}
