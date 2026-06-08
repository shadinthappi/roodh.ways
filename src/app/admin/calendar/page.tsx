"use client";

import React, { useEffect, useState, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────
interface CalendarEvent {
  _id: string;
  title: string;
  date: string;
  endDate?: string;
  category: string;
  customerName?: string;
  email?: string;
  phone?: string;
  travelers?: number;
  totalPrice?: number;
  notes?: string;
  color?: string;
  status?: string;
}

interface Booking {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  travelDate: string;
  travelers: number;
  totalPrice: number;
  status: string;
  durationDays?: number;
  itinerary?: { title: string; duration?: string; dayByDayPlan?: any[] };
}

// Indian holidays/festivals 2025-2027 (static important days)
const IMPORTANT_DAYS: { date: string; title: string; color: string }[] = [
  { date: "2026-01-01", title: "New Year's Day", color: "blue" },
  { date: "2026-01-14", title: "Makar Sankranti / Pongal", color: "orange" },
  { date: "2026-01-26", title: "Republic Day", color: "orange" },
  { date: "2026-03-14", title: "Holi", color: "purple" },
  { date: "2026-03-31", title: "Eid ul-Fitr (tentative)", color: "green" },
  { date: "2026-04-02", title: "Ram Navami", color: "orange" },
  { date: "2026-04-14", title: "Ambedkar Jayanti / Baisakhi", color: "blue" },
  { date: "2026-05-01", title: "May Day", color: "blue" },
  { date: "2026-06-07", title: "Eid ul-Adha (tentative)", color: "green" },
  { date: "2026-07-07", title: "Muharram (tentative)", color: "green" },
  { date: "2026-08-15", title: "Independence Day", color: "orange" },
  { date: "2026-08-22", title: "Janmashtami", color: "purple" },
  { date: "2026-09-05", title: "Milad-un-Nabi (tentative)", color: "green" },
  { date: "2026-10-02", title: "Gandhi Jayanti", color: "orange" },
  { date: "2026-10-02", title: "Dussehra", color: "purple" },
  { date: "2026-10-21", title: "Diwali", color: "yellow" },
  { date: "2026-11-14", title: "Children's Day", color: "blue" },
  { date: "2026-12-25", title: "Christmas", color: "red" },
  { date: "2026-12-31", title: "New Year's Eve", color: "blue" },
  { date: "2027-01-01", title: "New Year's Day", color: "blue" },
  { date: "2027-01-26", title: "Republic Day", color: "orange" },
  { date: "2027-03-04", title: "Holi", color: "purple" },
  { date: "2027-08-15", title: "Independence Day", color: "orange" },
  { date: "2027-10-02", title: "Gandhi Jayanti", color: "orange" },
  { date: "2027-11-10", title: "Diwali", color: "yellow" },
  { date: "2027-12-25", title: "Christmas", color: "red" },
  
  // International Days
  { date: "2026-02-14", title: "Valentine's Day", color: "red" },
  { date: "2026-03-08", title: "International Women's Day", color: "purple" },
  { date: "2026-04-22", title: "Earth Day", color: "green" },
  { date: "2026-10-31", title: "Halloween", color: "orange" },
  { date: "2026-11-26", title: "Thanksgiving (US)", color: "orange" },
  { date: "2026-11-27", title: "Black Friday", color: "other" },
  { date: "2027-02-14", title: "Valentine's Day", color: "red" },
  { date: "2027-03-08", title: "International Women's Day", color: "purple" },
  { date: "2027-04-22", title: "Earth Day", color: "green" },
  { date: "2027-10-31", title: "Halloween", color: "orange" },
  { date: "2027-11-25", title: "Thanksgiving (US)", color: "orange" },
  { date: "2027-11-26", title: "Black Friday", color: "other" },
];

const CATEGORY_COLORS: Record<string, string> = {
  booking: "bg-blue-500",
  "manual-booking": "bg-emerald-500",
  holiday: "bg-orange-500",
  festival: "bg-purple-500",
  deadline: "bg-red-500",
  reminder: "bg-yellow-500",
  other: "bg-gray-500",
  "important-day": "bg-orange-400",
};

const CATEGORY_LABELS: Record<string, string> = {
  booking: "Site Booking",
  "manual-booking": "Manual Booking",
  holiday: "Holiday",
  festival: "Festival",
  deadline: "Deadline",
  reminder: "Reminder",
  other: "Other",
  "important-day": "Important Day",
};

// ── Helpers ────────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ── Component ──────────────────────────────────────────────────────
export default function CalendarAdminPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formCategory, setFormCategory] = useState("manual-booking");
  const [formCustomerName, setFormCustomerName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formTravelers, setFormTravelers] = useState<number | "">("");
  const [formTotalPrice, setFormTotalPrice] = useState<number | "">("");
  const [formNotes, setFormNotes] = useState("");
  const [formColor, setFormColor] = useState("blue");
  const [formStatus, setFormStatus] = useState("Pending");
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const pid = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
      const ds = process.env.NEXT_PUBLIC_SANITY_DATASET;

      const evtQuery = encodeURIComponent(`*[_type == "calendarEvent"] | order(date asc) { _id, title, date, endDate, category, customerName, email, phone, travelers, totalPrice, notes, color, status }`);
      const bkQuery = encodeURIComponent(`*[_type == "booking"] | order(travelDate asc) { _id, customerName, email, phone, travelDate, durationDays, travelers, totalPrice, status, itinerary->{ title, duration, dayByDayPlan } }`);

      const [evtRes, bkRes] = await Promise.all([
        fetch(`https://${pid}.api.sanity.io/v2023-01-01/data/query/${ds}?query=${evtQuery}`),
        fetch(`https://${pid}.api.sanity.io/v2023-01-01/data/query/${ds}?query=${bkQuery}`),
      ]);

      if (evtRes.ok) {
        const d = await evtRes.json();
        setEvents(d.result || []);
      }
      if (bkRes.ok) {
        const d = await bkRes.json();
        setBookings(d.result || []);
      }
    } catch (err) {
      console.error("Failed to fetch calendar data", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Build a map: dateKey → events for the current view
  const eventMap = new Map<string, { title: string; color: string; category: string; _id?: string; event?: CalendarEvent; booking?: Booking }[]>();

  // 1. Add calendar events
  events.forEach((ev) => {
    const key = ev.date;
    if (!eventMap.has(key)) eventMap.set(key, []);
    eventMap.get(key)!.push({
      title: ev.title,
      color: CATEGORY_COLORS[ev.category] || "bg-gray-400",
      category: ev.category,
      _id: ev._id,
      event: ev,
    });
  });

  // 2. Add bookings
  bookings.forEach((bk) => {
    // Only show Confirmed bookings on calendar
    if (bk.status !== "Confirmed") return;

    let daysToSpan = bk.durationDays || 1;

    // If durationDays isn't explicitly set, try to derive it from itinerary
    if (!bk.durationDays || bk.durationDays === 1) {
      if (bk.itinerary?.duration) {
        const match = bk.itinerary.duration.match(/(\d+)\s*Day/i);
        if (match && match[1]) {
          daysToSpan = parseInt(match[1]);
        }
      }
      if (daysToSpan === 1 && bk.itinerary?.dayByDayPlan?.length) {
        daysToSpan = bk.itinerary.dayByDayPlan.length;
      }
    }

    const startDate = new Date(bk.travelDate);

    for (let i = 0; i < daysToSpan; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = formatDateKey(d.getFullYear(), d.getMonth(), d.getDate());

      if (!eventMap.has(key)) eventMap.set(key, []);
      eventMap.get(key)!.push({
        title: `${bk.customerName} — ${bk.itinerary?.title || "Custom Trip"} ${daysToSpan > 1 ? `(Day ${i + 1}/${daysToSpan})` : ""}`,
        color: "bg-emerald-500",
        category: "booking",
        booking: bk,
      });
    }
  });

  // 3. Add important days
  IMPORTANT_DAYS.forEach((d) => {
    if (!eventMap.has(d.date)) eventMap.set(d.date, []);
    eventMap.get(d.date)!.push({
      title: d.title,
      color: CATEGORY_COLORS["important-day"],
      category: "important-day",
    });
  });

  // Calendar grid
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const openAddModal = (dateKey: string) => {
    setEditingEvent(null);
    setFormTitle("");
    setFormDate(dateKey);
    setFormEndDate("");
    setFormCategory("manual-booking");
    setFormCustomerName("");
    setFormEmail("");
    setFormPhone("");
    setFormTravelers("");
    setFormTotalPrice("");
    setFormNotes("");
    setFormColor("blue");
    setFormStatus("Pending");
    setSelectedDate(dateKey);
    setShowModal(true);
  };

  const openEditModal = (ev: CalendarEvent) => {
    setEditingEvent(ev);
    setFormTitle(ev.title);
    setFormDate(ev.date);
    setFormEndDate(ev.endDate || "");
    setFormCategory(ev.category);
    setFormCustomerName(ev.customerName || "");
    setFormEmail(ev.email || "");
    setFormPhone(ev.phone || "");
    setFormTravelers(ev.travelers || "");
    setFormTotalPrice(ev.totalPrice || "");
    setFormNotes(ev.notes || "");
    setFormColor(ev.color || "blue");
    setFormStatus(ev.status || "Pending");
    setSelectedDate(ev.date);
    setShowModal(true);
  };

  const openDayView = (dateKey: string) => {
    setSelectedDate(dateKey);
  };

  const handleSave = async () => {
    if (!formTitle.trim() || !formDate) return;
    setIsSaving(true);

    const doc: any = {
      _type: "calendarEvent",
      title: formTitle,
      date: formDate,
      endDate: formEndDate || undefined,
      category: formCategory,
      customerName: formCustomerName || undefined,
      email: formEmail || undefined,
      phone: formPhone || undefined,
      travelers: formTravelers || undefined,
      totalPrice: formTotalPrice || undefined,
      notes: formNotes || undefined,
      color: formColor,
      status: formStatus,
    };

    try {
      const mutations = editingEvent
        ? [{ patch: { id: editingEvent._id, set: doc } }]
        : [{ create: { ...doc, _id: `calendarEvent-${Date.now()}` } }];

      const res = await fetch("/api/admin/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mutations }),
      });

      if (res.ok) {
        setShowModal(false);
        await fetchData();
      } else {
        const data = await res.json();
        alert(`Failed: ${data.message || data.error}`);
      }
    } catch {
      alert("Error saving event.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try {
      const res = await fetch("/api/admin/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mutations: [{ delete: { id } }] }),
      });
      if (res.ok) {
        await fetchData();
        if (selectedDate) setSelectedDate(selectedDate); // refresh sidebar
      }
    } catch {
      alert("Error deleting event.");
    }
  };

  // Events for the selected date sidebar
  const sidebarEvents = selectedDate ? (eventMap.get(selectedDate) || []) : [];

  // Upcoming events (next 14 days)
  const upcomingDates: string[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    upcomingDates.push(formatDateKey(d.getFullYear(), d.getMonth(), d.getDate()));
  }
  const upcomingEvents = upcomingDates.flatMap(dk => (eventMap.get(dk) || []).map(e => ({ ...e, dateKey: dk })));

  const isBookingCategory = formCategory === "manual-booking" || formCategory === "booking";

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-brand-offwhite">
      {/* Header */}
      <header className="h-20 shrink-0 border-b border-brand-dark/10 bg-brand-white px-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tighter text-brand-dark">Calendar</h1>
          <p className="text-sm font-sans text-brand-dark/60 font-medium">
            Track bookings, holidays, and important dates.
          </p>
        </div>
        <div className="flex gap-3">
          <a href="/admin/bookings" className="px-5 py-2.5 rounded-xl font-bold text-brand-dark bg-brand-offwhite border border-brand-dark/10 hover:bg-brand-dark/5 shadow-sm transition-all text-sm flex items-center gap-2">
            View Bookings
          </a>
          <button onClick={() => openAddModal(todayKey)} className="px-5 py-2.5 rounded-xl font-bold text-white bg-brand-blue hover:bg-brand-blue/90 shadow-sm transition-all text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Event
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Calendar Grid */}
          <div className="bg-brand-white rounded-2xl border border-brand-dark/10 shadow-sm overflow-hidden">
            {/* Month nav */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-dark/10">
              <button onClick={prevMonth} className="w-9 h-9 rounded-lg border border-brand-dark/15 flex items-center justify-center hover:bg-brand-offwhite transition-colors text-brand-dark/70">←</button>
              <h2 className="font-heading font-black text-xl uppercase tracking-tight text-brand-dark">{MONTHS[month]} {year}</h2>
              <button onClick={nextMonth} className="w-9 h-9 rounded-lg border border-brand-dark/15 flex items-center justify-center hover:bg-brand-offwhite transition-colors text-brand-dark/70">→</button>
            </div>

            {isLoading ? (
              <div className="p-20 flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-brand-blue/20 border-t-brand-blue animate-spin" />
                <p className="mt-4 text-xs font-bold text-brand-dark/50 uppercase tracking-widest">Loading...</p>
              </div>
            ) : (
              <div className="p-4">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                    <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-brand-dark/40 py-2">{d}</div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for first week offset */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-24 rounded-lg" />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateKey = formatDateKey(year, month, day);
                    const dayEvents = eventMap.get(dateKey) || [];
                    const isToday = dateKey === todayKey;
                    const isSelected = dateKey === selectedDate;

                    return (
                      <div
                        key={day}
                        onClick={() => openDayView(dateKey)}
                        onDoubleClick={() => openAddModal(dateKey)}
                        className={`h-24 rounded-lg border p-1.5 cursor-pointer transition-all hover:border-brand-blue/40 flex flex-col ${
                          isSelected
                            ? "border-brand-blue bg-brand-blue/5 ring-2 ring-brand-blue/20"
                            : isToday
                            ? "border-brand-blue/30 bg-brand-blue/5"
                            : "border-brand-dark/8 hover:bg-brand-offwhite/50"
                        }`}
                      >
                        <span className={`text-xs font-bold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                          isToday ? "bg-brand-blue text-white" : "text-brand-dark/70"
                        }`}>
                          {day}
                        </span>
                        <div className="flex-1 overflow-hidden mt-0.5 space-y-0.5">
                          {dayEvents.slice(0, 3).map((ev, ei) => (
                            <div key={ei} className={`${ev.color} text-white text-[9px] font-bold px-1.5 py-0.5 rounded truncate leading-tight`}>
                              {ev.title}
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-[9px] text-brand-dark/50 font-bold pl-1">+{dayEvents.length - 3} more</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="px-6 py-3 border-t border-brand-dark/10 flex flex-wrap gap-4">
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${CATEGORY_COLORS[key]}`} />
                  <span className="text-[10px] font-bold text-brand-dark/50 uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Selected Date Details */}
            {selectedDate && (
              <div className="bg-brand-white rounded-2xl border border-brand-dark/10 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-brand-dark/10 flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-sm uppercase tracking-wide text-brand-dark">
                      {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    </h3>
                    <p className="text-[10px] text-brand-dark/50 font-bold uppercase tracking-widest mt-0.5">{sidebarEvents.length} event(s)</p>
                  </div>
                  <button onClick={() => openAddModal(selectedDate)} className="w-8 h-8 rounded-lg bg-brand-blue text-white flex items-center justify-center hover:bg-brand-blue/80 transition-colors text-lg font-bold" title="Add event on this date">+</button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {sidebarEvents.length === 0 ? (
                    <div className="p-6 text-center text-brand-dark/40 text-xs font-bold uppercase tracking-widest">
                      No events<br /><span className="font-medium normal-case tracking-normal text-brand-dark/30">Double-click a date to add one</span>
                    </div>
                  ) : (
                    <div className="divide-y divide-brand-dark/5">
                      {sidebarEvents.map((ev, i) => (
                        <div key={i} className="px-5 py-3 flex items-start gap-3 hover:bg-brand-offwhite/50 transition-colors">
                          <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${ev.color}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-brand-dark truncate">{ev.title}</p>
                            <p className="text-[10px] text-brand-dark/50 font-bold uppercase tracking-widest">{CATEGORY_LABELS[ev.category] || ev.category}</p>
                            {ev.booking && (
                              <p className="text-[10px] text-brand-dark/50 mt-0.5">{ev.booking.travelers} traveler(s) · ₹{ev.booking.totalPrice?.toLocaleString()} · {ev.booking.status}</p>
                            )}
                          </div>
                          {ev._id && (
                            <div className="flex gap-1 shrink-0">
                              <button onClick={() => openEditModal(ev.event!)} className="text-[10px] text-brand-blue font-bold hover:underline">Edit</button>
                              <button onClick={() => handleDelete(ev._id!)} className="text-[10px] text-red-500 font-bold hover:underline">Del</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Upcoming */}
            <div className="bg-brand-white rounded-2xl border border-brand-dark/10 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-brand-dark/10">
                <h3 className="font-heading font-bold text-sm uppercase tracking-wide text-brand-dark">Upcoming (14 days)</h3>
              </div>
              <div className="max-h-[350px] overflow-y-auto">
                {upcomingEvents.length === 0 ? (
                  <div className="p-6 text-center text-brand-dark/40 text-xs font-bold uppercase tracking-widest">Nothing upcoming</div>
                ) : (
                  <div className="divide-y divide-brand-dark/5">
                    {upcomingEvents.map((ev, i) => (
                      <div key={i} className="px-5 py-3 flex items-start gap-3 hover:bg-brand-offwhite/50 cursor-pointer transition-colors" onClick={() => { setSelectedDate(ev.dateKey); setMonth(parseInt(ev.dateKey.split("-")[1]) - 1); setYear(parseInt(ev.dateKey.split("-")[0])); }}>
                        <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${ev.color}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-brand-dark truncate">{ev.title}</p>
                          <p className="text-[10px] text-brand-dark/50 font-bold">
                            {new Date(ev.dateKey + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {CATEGORY_LABELS[ev.category] || ev.category}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Add/Edit Modal ─────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-white rounded-2xl shadow-2xl border border-brand-dark/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-brand-dark/10 flex items-center justify-between">
              <h2 className="font-heading font-black text-lg uppercase tracking-tight text-brand-dark">
                {editingEvent ? "Edit Event" : "Add Event"}
              </h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg border border-brand-dark/15 flex items-center justify-center hover:bg-brand-offwhite transition-colors text-brand-dark/60">×</button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-brand-dark/60 uppercase tracking-widest block mb-1">Title *</label>
                  <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g. Mumbai Trip — Rajesh" className="w-full bg-brand-offwhite/50 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-blue/20" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-brand-dark/60 uppercase tracking-widest block mb-1">Date *</label>
                  <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full bg-brand-offwhite/50 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-blue/20" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-brand-dark/60 uppercase tracking-widest block mb-1">End Date</label>
                  <input type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} className="w-full bg-brand-offwhite/50 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-blue/20" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-brand-dark/60 uppercase tracking-widest block mb-1">Category *</label>
                  <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className="w-full bg-brand-offwhite/50 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-blue/20">
                    <option value="manual-booking">Manual Booking</option>
                    <option value="holiday">Holiday</option>
                    <option value="festival">Festival</option>
                    <option value="deadline">Deadline</option>
                    <option value="reminder">Reminder</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-brand-dark/60 uppercase tracking-widest block mb-1">Status</label>
                  <select value={formStatus} onChange={(e) => setFormStatus(e.target.value)} className="w-full bg-brand-offwhite/50 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-blue/20">
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Booking-specific fields */}
              {isBookingCategory && (
                <div className="border-t border-brand-dark/10 pt-4 space-y-4">
                  <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Booking Details</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-[10px] font-black text-brand-dark/60 uppercase tracking-widest block mb-1">Customer Name</label>
                      <input type="text" value={formCustomerName} onChange={(e) => setFormCustomerName(e.target.value)} placeholder="Full name" className="w-full bg-brand-offwhite/50 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-blue/20" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-brand-dark/60 uppercase tracking-widest block mb-1">Email</label>
                      <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="email@example.com" className="w-full bg-brand-offwhite/50 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-blue/20" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-brand-dark/60 uppercase tracking-widest block mb-1">Phone</label>
                      <input type="tel" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="+91..." className="w-full bg-brand-offwhite/50 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-blue/20" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-brand-dark/60 uppercase tracking-widest block mb-1">Travelers</label>
                      <input type="number" min={1} value={formTravelers} onChange={(e) => setFormTravelers(e.target.value ? parseInt(e.target.value) : "")} className="w-full bg-brand-offwhite/50 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-blue/20" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-brand-dark/60 uppercase tracking-widest block mb-1">Total Price (₹)</label>
                      <input type="number" value={formTotalPrice} onChange={(e) => setFormTotalPrice(e.target.value ? parseInt(e.target.value) : "")} className="w-full bg-brand-offwhite/50 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-blue/20" />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-black text-brand-dark/60 uppercase tracking-widest block mb-1">Notes</label>
                <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} rows={3} placeholder="Any additional details..." className="w-full bg-brand-offwhite/50 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-blue/20 resize-y" />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-brand-dark/10 flex justify-between items-center">
              {editingEvent && (
                <button onClick={() => { handleDelete(editingEvent._id); setShowModal(false); }} className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-widest transition-colors">Delete</button>
              )}
              <div className="ml-auto flex gap-3">
                <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-brand-dark/60 hover:text-brand-dark border border-brand-dark/15 hover:bg-brand-offwhite transition-all">Cancel</button>
                <button onClick={handleSave} disabled={isSaving || !formTitle.trim() || !formDate} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 shadow-sm transition-all">
                  {isSaving ? "Saving..." : editingEvent ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
