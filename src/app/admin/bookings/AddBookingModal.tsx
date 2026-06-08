"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AddBookingModalProps {
  itineraries: { _id: string; title: string }[];
}

export default function AddBookingModal({ itineraries }: AddBookingModalProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    travelDate: "",
    durationDays: 1,
    travelers: 1,
    status: "Pending",
    totalPrice: "",
    notes: "",
    itineraryId: "", // Optional now
  });

  const handleSave = async () => {
    if (!form.customerName || !form.email || !form.travelDate) {
      alert("Please fill required fields: Name, Email, Travel Date");
      return;
    }
    
    setIsSaving(true);
    
    const doc: any = {
      _type: "booking",
      customerName: form.customerName,
      email: form.email,
      phone: form.phone,
      travelDate: form.travelDate,
      durationDays: form.durationDays,
      travelers: form.travelers,
      status: form.status,
      totalPrice: form.totalPrice ? Number(form.totalPrice) : undefined,
      notes: form.notes,
    };

    if (form.itineraryId) {
      doc.itinerary = {
        _type: "reference",
        _ref: form.itineraryId,
      };
    }

    try {
      const res = await fetch("/api/admin/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mutations: [{ create: { ...doc, _id: `booking-${Date.now()}` } }]
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setForm({
          customerName: "", email: "", phone: "", travelDate: "",
          durationDays: 1, travelers: 1, status: "Pending", totalPrice: "", notes: "", itineraryId: ""
        });
        router.refresh(); // Refresh the Server Component to show new booking
      } else {
        const data = await res.json();
        alert(`Failed: ${data.message || "Unknown error"}`);
      }
    } catch (e) {
      alert("Failed to save booking");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="flex gap-3">
        <Link 
          href="/admin/calendar" 
          className="px-5 py-2.5 rounded-xl font-bold text-brand-dark bg-brand-offwhite border border-brand-dark/10 hover:bg-brand-dark/5 shadow-sm transition-all text-sm flex items-center gap-2"
        >
          View Calendar
        </Link>
        <button 
          onClick={() => setShowModal(true)} 
          className="px-5 py-2.5 rounded-xl font-bold text-white bg-brand-blue hover:bg-brand-blue/90 shadow-sm transition-all text-sm flex items-center gap-2"
        >
          + Add Manual Booking
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-white rounded-2xl shadow-2xl border border-brand-dark/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-brand-dark/10 flex items-center justify-between">
              <h2 className="font-heading font-black text-lg uppercase tracking-tight text-brand-dark">Add Manual Booking</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg border border-brand-dark/15 flex items-center justify-center hover:bg-brand-offwhite transition-colors text-brand-dark/60">×</button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-brand-dark/60 uppercase tracking-widest block mb-1">Customer Name *</label>
                  <input type="text" value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} className="w-full bg-brand-offwhite/50 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-brand-dark/60 uppercase tracking-widest block mb-1">Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-brand-offwhite/50 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-brand-dark/60 uppercase tracking-widest block mb-1">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-brand-offwhite/50 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-brand-dark/60 uppercase tracking-widest block mb-1">Travel Date *</label>
                  <input type="date" value={form.travelDate} onChange={e => setForm({...form, travelDate: e.target.value})} className="w-full bg-brand-offwhite/50 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-brand-dark/60 uppercase tracking-widest block mb-1">No. of Days *</label>
                  <input type="number" min="1" value={form.durationDays} onChange={e => setForm({...form, durationDays: parseInt(e.target.value) || 1})} className="w-full bg-brand-offwhite/50 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-brand-dark/60 uppercase tracking-widest block mb-1">Travelers</label>
                  <input type="number" min="1" value={form.travelers} onChange={e => setForm({...form, travelers: parseInt(e.target.value) || 1})} className="w-full bg-brand-offwhite/50 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-brand-dark/60 uppercase tracking-widest block mb-1">Total Price (₹)</label>
                  <input type="number" value={form.totalPrice} onChange={e => setForm({...form, totalPrice: e.target.value})} className="w-full bg-brand-offwhite/50 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-brand-dark/60 uppercase tracking-widest block mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-brand-offwhite/50 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans">
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-brand-dark/60 uppercase tracking-widest block mb-1">Itinerary (Optional)</label>
                  <select value={form.itineraryId} onChange={e => setForm({...form, itineraryId: e.target.value})} className="w-full bg-brand-offwhite/50 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans">
                    <option value="">-- Custom Trip (No Itinerary) --</option>
                    {itineraries.map(it => (
                      <option key={it._id} value={it._id}>{it.title}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-brand-dark/60 uppercase tracking-widest block mb-1">Notes</label>
                  <textarea rows={2} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full bg-brand-offwhite/50 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans"></textarea>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-brand-dark/10 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-brand-dark/60 hover:bg-brand-offwhite transition-all">Cancel</button>
              <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 transition-all">
                {isSaving ? "Saving..." : "Save Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
