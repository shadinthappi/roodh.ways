"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  bookingId: string;
  initialStatus: string;
}

export default function BookingStatusSelect({ bookingId, initialStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (s: string) => {
    switch (s) {
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Contacted": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsUpdating(true);

    try {
      const res = await fetch("/api/admin/bookings/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      
      router.refresh();
    } catch (err) {
      console.error(err);
      setStatus(initialStatus); // Revert on failure
      alert("Failed to update booking status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative">
      <select
        value={status}
        onChange={handleChange}
        disabled={isUpdating}
        className={`appearance-none cursor-pointer pl-3 pr-8 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-blue/30 ${getStatusColor(status)} ${isUpdating ? "opacity-50" : ""}`}
      >
        <option value="Pending">Pending</option>
        <option value="Contacted">Contacted</option>
        <option value="Confirmed">Confirmed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-brand-dark/50">
        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
      </div>
    </div>
  );
}
