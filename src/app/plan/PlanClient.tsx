"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Wallet, Users, Compass, ChevronDown, Check, Loader2, X, Sun, Moon, Sunset } from "lucide-react";
import Image from "next/image";
import Header from "@/components/Header";
import ItineraryCard from "@/components/ItineraryCard";
import NewsletterSignup from "@/components/NewsletterSignup";

// Filter options for existing itineraries
const budgets = ["Any Budget", "Budget-Friendly", "Mid-Range", "Luxury", "Premium"];
const durations = ["Any Duration", "3–5 Days", "6–8 Days", "9–12 Days", "2+ Weeks"];
const styles = ["Any Style", "Heritage", "Adventure", "Nature", "Beach", "Spiritual", "Food & Culture"];

// AI planner options
const popularDestinations = [
  "Kerala Backwaters", "Rajasthan Heritage", "Goa Beaches", "Himalayan Trek", "Varanasi Spiritual",
  "Bali, Indonesia", "Thailand", "Vietnam", "Sri Lanka", "Dubai", "Singapore", "Maldives"
];
const budgetOptions = ["Budget-Friendly", "Mid-Range", "Luxury", "Premium"];
const styleOptions = ["Heritage", "Adventure", "Nature", "Beach", "Spiritual", "Food & Culture", "Wildlife", "Romantic"];
const groupOptions = ["Solo", "Couple", "Friends", "Family", "Corporate"];

const loadingMessages = [
  "Researching destinations...",
  "Finding the best local experiences...",
  "Planning activities for each day...",
  "Adding insider tips & hidden gems...",
  "Estimating costs & logistics...",
  "Crafting your perfect itinerary...",
];

const timeIcons: Record<string, React.ReactNode> = {
  "Morning": <Sun size={14} className="text-amber-500" />,
  "Afternoon": <Sunset size={14} className="text-orange-500" />,
  "Evening": <Moon size={14} className="text-indigo-400" />,
};

export default function PlanClient({ itineraries, footer }: { itineraries: any[], footer: React.ReactNode }) {
  // Filter state for existing itineraries
  const [budget, setBudget] = useState("Any Budget");
  const [duration, setDuration] = useState("Any Duration");
  const [style, setStyle] = useState("Any Style");

  // AI planner state
  const [aiMode, setAiMode] = useState<"input" | "loading" | "result">("input");
  const [aiDestination, setAiDestination] = useState("");
  const [aiDuration, setAiDuration] = useState("7");
  const [aiBudget, setAiBudget] = useState("Mid-Range");
  const [aiStyle, setAiStyle] = useState<string[]>([]);
  const [aiGroup, setAiGroup] = useState("Couple");
  const [aiNotes, setAiNotes] = useState("");
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);
  const [aiError, setAiError] = useState("");
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  // Booking modal state
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({ customerName: "", email: "", phone: "", travelDate: "", travelers: "2", notes: "" });
  const [bookingStatus, setBookingStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [bookingId, setBookingId] = useState("");

  const resultRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Cycle loading messages
  useEffect(() => {
    if (aiMode !== "loading") return;
    const interval = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [aiMode]);

  const toggleStyle = (s: string) => {
    setAiStyle((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const generateItinerary = async () => {
    if (!aiDestination.trim()) {
      setAiError("Please enter a destination to get started.");
      return;
    }
    setAiError("");
    setAiMode("loading");
    setLoadingMsgIdx(0);

    // Scroll to the hero section so the user sees the loading animation
    setTimeout(() => heroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);

    const prompt = `Plan a ${aiDuration}-day trip to ${aiDestination} for a ${aiGroup.toLowerCase()} group. Budget: ${aiBudget}. Travel style: ${aiStyle.length > 0 ? aiStyle.join(", ") : "Mixed"}. ${aiNotes ? `Special requests: ${aiNotes}` : ""}`;

    try {
      const res = await fetch("/api/ai-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      if (data.success && data.itinerary) {
        setGeneratedItinerary(data.itinerary);
        setAiMode("result");
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
      } else {
        setAiError(data.message || "Failed to generate itinerary. Please try again.");
        setAiMode("input");
      }
    } catch (err) {
      setAiError("Network error. Please check your connection and try again.");
      setAiMode("input");
    }
  };

  const submitBooking = async () => {
    if (!bookingForm.customerName || !bookingForm.email || !bookingForm.phone || !bookingForm.travelDate) return;
    setBookingStatus("submitting");
    try {
      const res = await fetch("/api/booking/ai-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itinerary: generatedItinerary, ...bookingForm }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingStatus("success");
        setBookingId(data.bookingId);
      } else {
        setBookingStatus("error");
      }
    } catch {
      setBookingStatus("error");
    }
  };

  const filtered = itineraries.filter((itin) => {
    const bMatch = budget === "Any Budget" || itin.budget === budget;
    const dMatch = duration === "Any Duration" || itin.duration === duration;
    const sMatch = style === "Any Style" || itin.style === style;
    return bMatch && dMatch && sMatch;
  });

  return (
    <main className="min-h-screen bg-brand-white">
      <Header />

      {/* ═══════════════════════════════════════════ */}
      {/* HERO + AI PLANNER */}
      {/* ═══════════════════════════════════════════ */}
      <section className="w-full bg-brand-dark pt-36 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #6d4527 0%, transparent 50%)" }} />
        <div className="absolute inset-0 opacity-8"
          style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #8a5a35 0%, transparent 40%)" }} />
        {/* Faint logo watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none z-0">
          <Image src="/logo-white.png" alt="" width={600} unoptimized height={600} className="object-contain" />
        </div>

        <div ref={heroRef} className="max-w-7xl mx-auto relative z-10">
          {/* Title */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <Image src="/logo-white.png" alt="Roodh.ways" width={80} unoptimized height={80} className="mx-auto opacity-80" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 border bg-brand-blue/20 border-brand-blue/40"
            >
              <Image src="/logo-white.png" alt="" width={16} height={16} />
              <span className="font-sans font-bold uppercase tracking-widest text-xs text-white">AI-Powered Trip Planning</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="font-heading font-black text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter text-brand-white leading-[0.9] mb-6"
            >
              Plan Your<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-sky-400">Dream Trip</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="font-sans text-brand-white/60 text-lg max-w-2xl mx-auto"
            >
              Tell us where you want to go and how you want to travel. Our AI will craft a detailed day-by-day itinerary in seconds.
            </motion.p>
          </div>

          {/* AI Input / Loading / Result */}
          <AnimatePresence mode="wait">
            {aiMode === "input" && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto bg-brand-white/5 border border-brand-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12"
              >
                <div className="mb-8">
                  <label className="flex items-center gap-2 font-sans font-bold uppercase tracking-widest text-xs text-white mb-3">
                    <MapPin size={14} className="text-brand-blue-light" /> Where do you want to go?
                  </label>
                  <input
                    type="text"
                    value={aiDestination}
                    onChange={(e) => setAiDestination(e.target.value)}
                    placeholder="e.g. Kerala, Bali, Rajasthan, Thailand..."
                    className="w-full bg-white/10 border border-white/30 text-white placeholder-white/40 px-5 py-4 rounded-xl font-sans text-base focus:outline-none focus:border-brand-blue-light transition-colors"
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {popularDestinations.map((d) => (
                      <button key={d} onClick={() => setAiDestination(d)}
                        className={`px-3 py-1.5 rounded-full font-sans text-xs font-bold border transition-all ${aiDestination === d ? "bg-brand-blue text-white border-brand-blue" : "border-white/30 text-white/70 hover:border-white/50 hover:text-white"}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration + Budget + Group (3-column) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Duration */}
                  <div>
                    <label className="flex items-center gap-2 font-sans font-bold uppercase tracking-widest text-xs text-white mb-3">
                      <Clock size={14} className="text-brand-blue-light" /> Duration (days)
                    </label>
                    <input
                      type="number" min="2" max="30"
                      value={aiDuration}
                      onChange={(e) => setAiDuration(e.target.value)}
                      className="w-full bg-white/10 border border-white/30 text-white px-5 py-4 rounded-xl font-sans text-base focus:outline-none focus:border-brand-blue-light"
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="flex items-center gap-2 font-sans font-bold uppercase tracking-widest text-xs text-white mb-3">
                      <Wallet size={14} className="text-brand-blue-light" /> Budget
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {budgetOptions.map((b) => (
                        <button key={b} onClick={() => setAiBudget(b)}
                          className={`px-3 py-2 rounded-lg font-sans text-xs font-bold transition-all ${aiBudget === b ? "bg-brand-blue text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Group */}
                  <div>
                    <label className="flex items-center gap-2 font-sans font-bold uppercase tracking-widest text-xs text-white mb-3">
                      <Users size={14} className="text-brand-blue-light" /> Group Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {groupOptions.map((g) => (
                        <button key={g} onClick={() => setAiGroup(g)}
                          className={`px-3 py-2 rounded-lg font-sans text-xs font-bold transition-all ${aiGroup === g ? "bg-brand-blue text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Travel Style */}
                <div className="mb-8">
                  <label className="flex items-center gap-2 font-sans font-bold uppercase tracking-widest text-xs text-white mb-3">
                    <Compass size={14} className="text-brand-blue-light" /> Travel Style (select multiple)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {styleOptions.map((s) => (
                      <button key={s} onClick={() => toggleStyle(s)}
                        className={`px-4 py-2 rounded-full font-sans text-sm font-bold border transition-all flex items-center gap-2 ${aiStyle.includes(s) ? "bg-brand-blue text-white border-brand-blue" : "border-white/30 text-white/70 hover:border-white/50"}`}
                      >
                        {aiStyle.includes(s) && <Check size={14} />}
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Requests */}
                <div className="mb-8">
                  <label className="font-sans font-bold uppercase tracking-widest text-xs text-white mb-3 block">
                    Special Requests (optional)
                  </label>
                  <textarea
                    value={aiNotes}
                    onChange={(e) => setAiNotes(e.target.value)}
                    placeholder="e.g. We love street food, want to avoid crowded tourist spots, interested in local art..."
                    rows={3}
                    className="w-full bg-white/10 border border-white/30 text-white placeholder-white/40 px-5 py-4 rounded-xl font-sans text-base leading-relaxed focus:outline-none focus:border-brand-blue-light resize-none"
                  />
                </div>

                {/* Error */}
                {aiError && (
                  <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl font-sans text-sm mb-6">
                    {aiError}
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={generateItinerary}
                  className="w-full bg-brand-blue hover:bg-brand-blue-light text-white py-5 rounded-2xl font-heading uppercase tracking-wider text-lg font-bold transition-all shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-3"
                >
                  <Image src="/logo-white.png" alt="" width={24} height={24} />
                  Generate My Itinerary
                </button>
              </motion.div>
            )}

            {aiMode === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto text-center py-20"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block mb-8"
                >
                  <div className="w-24 h-24 rounded-full bg-brand-blue flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(13,71,161,0.5)]">
                    <Image src="/logo-white.png" alt="Roodh.ways" width={48} height={48} />
                  </div>
                </motion.div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingMsgIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="font-heading text-2xl uppercase tracking-wider text-brand-white mb-4"
                  >
                    {loadingMessages[loadingMsgIdx]}
                  </motion.p>
                </AnimatePresence>
                <div className="w-64 h-1.5 bg-brand-white/10 rounded-full mx-auto overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-brand-blue to-sky-400"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 18, ease: "linear" }}
                  />
                </div>
                <p className="font-sans text-brand-white/40 text-sm mt-6">This usually takes 10–20 seconds</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* GENERATED ITINERARY RESULT */}
      {/* ═══════════════════════════════════════════ */}
      {aiMode === "result" && generatedItinerary && (
        <section ref={resultRef} className="bg-brand-offwhite py-20 px-6">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-sans font-bold uppercase tracking-widest text-xs mb-6">
                <Check size={14} /> Itinerary Generated
              </div>
              <h2 className="font-heading font-black text-4xl md:text-6xl uppercase tracking-tighter text-brand-dark mb-4">
                {generatedItinerary.title}
              </h2>
              <p className="font-sans text-brand-dark/60 text-lg max-w-2xl mx-auto mb-8">
                {generatedItinerary.overview}
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { icon: <MapPin size={16} />, label: generatedItinerary.destination },
                  { icon: <Clock size={16} />, label: generatedItinerary.duration },
                  { icon: <Wallet size={16} />, label: `${generatedItinerary.estimatedCostPerPerson}/person` },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-2 bg-brand-white border border-brand-dark/10 px-4 py-2 rounded-full text-brand-dark font-sans text-sm font-bold">
                    {stat.icon} {stat.label}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Highlights */}
            {generatedItinerary.highlights && (
              <div className="bg-brand-white border border-brand-dark/10 rounded-2xl p-8 mb-12 shadow-sm">
                <h3 className="font-heading font-bold text-xl uppercase tracking-tight text-brand-dark mb-4">Trip Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {generatedItinerary.highlights.map((h: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 font-sans text-brand-dark/80">
                      <svg className="w-3.5 h-3.5 text-brand-blue shrink-0 mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h2M6.34 17.66l-2.83-2.83M20.57 3.43l-2.83 2.83M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
                      </svg>
                      {h}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Day-by-Day Timeline */}
            <div className="space-y-6 mb-16">
              {generatedItinerary.days?.map((day: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-brand-white border border-brand-dark/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Day header */}
                  <div className="bg-brand-dark px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="bg-brand-blue text-white w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm">
                        {day.day}
                      </span>
                      <div>
                        <h4 className="font-heading font-bold text-lg uppercase tracking-tight text-brand-white">{day.title}</h4>
                        <p className="font-sans text-brand-white/50 text-xs uppercase tracking-widest">{day.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Activities */}
                  <div className="p-8 space-y-6">
                    {day.activities?.map((act: any, j: number) => (
                      <div key={j} className="flex gap-4">
                        <div className="flex items-center gap-2 w-28 shrink-0">
                          {timeIcons[act.time] || <Sun size={14} className="text-amber-500" />}
                          <span className="font-sans text-xs font-bold uppercase tracking-widest text-brand-dark/50">{act.time}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-sans text-brand-dark font-medium">{act.activity}</p>
                          {act.tip && (
                            <p className="font-sans text-brand-blue text-sm mt-1 italic flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-brand-blue shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5h6zM9 18h6M10 22h4"></path>
                            </svg>
                            {act.tip}
                          </p>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Accommodation & Meals */}
                    <div className="border-t border-brand-dark/5 pt-4 mt-4 flex flex-wrap gap-6 text-sm font-sans text-brand-dark/60">
                      {day.accommodation && (
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-brand-dark/60 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10"></path>
                          </svg>
                          {day.accommodation}
                        </span>
                      )}
                      {day.meals && (
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-brand-dark/60 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7H17M18 8H6M18 12H6"></path>
                          </svg>
                          {day.meals}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Packing Tips + Travel Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {generatedItinerary.packingTips && (
                <div className="bg-brand-white border border-brand-dark/10 rounded-2xl p-8 shadow-sm">
                  <h3 className="font-heading font-bold text-xl uppercase tracking-tight text-brand-dark mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M4 20V10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"></path>
                      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5"></path>
                    </svg>
                    Packing Tips
                  </h3>
                  <ul className="space-y-3">
                    {generatedItinerary.packingTips.map((tip: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 font-sans text-brand-dark/80">
                        <Check size={14} className="text-brand-blue shrink-0 mt-1" /> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {generatedItinerary.travelNotes && (
                <div className="bg-brand-white border border-brand-dark/10 rounded-2xl p-8 shadow-sm">
                  <h3 className="font-heading font-bold text-xl uppercase tracking-tight text-brand-dark mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"></path>
                    </svg>
                    Travel Notes
                  </h3>
                  <p className="font-sans text-brand-dark/70 leading-relaxed">{generatedItinerary.travelNotes}</p>
                  {generatedItinerary.bestTimeToVisit && (
                    <p className="font-sans text-brand-dark/70 mt-4"><strong>Best time to visit:</strong> {generatedItinerary.bestTimeToVisit}</p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setShowBooking(true)}
                className="bg-brand-blue hover:bg-brand-blue/80 text-white px-10 py-5 rounded-2xl font-heading uppercase tracking-wider font-bold transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5s-2.5 0-4 1.5L13.5 8.5 5.3 6.7 3.5 8.5l8.3 4.8-3.5 3.5-3.5-1L3 17.5 7 19.5l2 4 1.7-1.8-1-3.5 3.5-3.5 4.8 8.3 1.8-1.8z"></path>
                </svg>
                Book This Trip
              </button>
              <button
                onClick={() => { setAiMode("input"); setGeneratedItinerary(null); }}
                className="bg-brand-dark hover:bg-brand-dark/80 text-white px-10 py-5 rounded-2xl font-heading uppercase tracking-wider font-bold transition-all shadow-lg hover:-translate-y-0.5"
              >
                Generate Another
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* BOOKING MODAL */}
      {/* ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {showBooking && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-dark/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => { if (bookingStatus !== "submitting") setShowBooking(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-brand-white rounded-3xl p-8 md:p-10 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setShowBooking(false)} className="absolute top-4 right-4 text-brand-dark/40 hover:text-brand-dark">
                <X size={24} />
              </button>

              {bookingStatus === "success" ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={40} className="text-green-600" />
                  </div>
                  <h3 className="font-heading font-bold text-3xl uppercase text-brand-dark mb-3">Booking Confirmed!</h3>
                  <p className="font-sans text-brand-dark/60 mb-2">Your booking ID: <strong className="text-brand-blue">{bookingId.slice(0, 12)}...</strong></p>
                  <p className="font-sans text-brand-dark/50 text-sm">Our team will reach out to you within 24 hours to finalize your trip details.</p>
                  <button onClick={() => { setShowBooking(false); setBookingStatus("idle"); }} className="mt-8 bg-brand-dark text-white px-8 py-3 rounded-xl font-heading uppercase tracking-wider font-bold">
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-heading font-bold text-2xl uppercase tracking-tight text-brand-dark mb-2">Book This Trip</h3>
                  <p className="font-sans text-brand-dark/50 text-sm mb-8">{generatedItinerary?.title} — {generatedItinerary?.duration}</p>

                  <div className="space-y-5">
                    <div>
                      <label className="font-sans text-xs font-bold uppercase tracking-widest text-brand-dark/50 mb-1 block">Full Name *</label>
                      <input type="text" value={bookingForm.customerName} onChange={(e) => setBookingForm({ ...bookingForm, customerName: e.target.value })}
                        className="w-full border border-brand-dark/20 px-4 py-3 rounded-xl font-sans focus:outline-none focus:border-brand-blue" />
                    </div>
                    <div>
                      <label className="font-sans text-xs font-bold uppercase tracking-widest text-brand-dark/50 mb-1 block">Email *</label>
                      <input type="email" value={bookingForm.email} onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                        className="w-full border border-brand-dark/20 px-4 py-3 rounded-xl font-sans focus:outline-none focus:border-brand-blue" />
                    </div>
                    <div>
                      <label className="font-sans text-xs font-bold uppercase tracking-widest text-brand-dark/50 mb-1 block">Phone *</label>
                      <input type="tel" value={bookingForm.phone} onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                        className="w-full border border-brand-dark/20 px-4 py-3 rounded-xl font-sans focus:outline-none focus:border-brand-blue" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-sans text-xs font-bold uppercase tracking-widest text-brand-dark/50 mb-1 block">Travel Date *</label>
                        <input type="date" value={bookingForm.travelDate} onChange={(e) => setBookingForm({ ...bookingForm, travelDate: e.target.value })}
                          className="w-full border border-brand-dark/20 px-4 py-3 rounded-xl font-sans focus:outline-none focus:border-brand-blue" />
                      </div>
                      <div>
                        <label className="font-sans text-xs font-bold uppercase tracking-widest text-brand-dark/50 mb-1 block">Travelers</label>
                        <input type="number" min="1" max="50" value={bookingForm.travelers} onChange={(e) => setBookingForm({ ...bookingForm, travelers: e.target.value })}
                          className="w-full border border-brand-dark/20 px-4 py-3 rounded-xl font-sans focus:outline-none focus:border-brand-blue" />
                      </div>
                    </div>
                    <div>
                      <label className="font-sans text-xs font-bold uppercase tracking-widest text-brand-dark/50 mb-1 block">Additional Notes</label>
                      <textarea value={bookingForm.notes} onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })} rows={2}
                        className="w-full border border-brand-dark/20 px-4 py-3 rounded-xl font-sans focus:outline-none focus:border-brand-blue resize-none" />
                    </div>
                  </div>

                  {bookingStatus === "error" && (
                    <p className="text-red-500 font-sans text-sm mt-4">Booking failed. Please try again.</p>
                  )}

                  <button
                    onClick={submitBooking}
                    disabled={bookingStatus === "submitting"}
                    className="w-full mt-8 bg-brand-blue hover:bg-brand-blue/80 disabled:opacity-50 text-white py-4 rounded-xl font-heading uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    {bookingStatus === "submitting" ? (
                      <><Loader2 size={18} className="animate-spin" /> Submitting...</>
                    ) : (
                      <>Confirm Booking</>
                    )}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════ */}
      {/* EXISTING ITINERARIES SECTION */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-brand-white py-20 px-6 border-t border-brand-dark/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-5xl uppercase font-black tracking-tighter text-brand-dark mb-4">Browse Curated Trips</h2>
          <p className="font-sans text-brand-dark/50 mb-10">Or explore our hand-crafted itineraries below.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-brand-dark/50 mb-3">Budget</p>
              <div className="flex flex-wrap gap-2">
                {budgets.map((b) => (
                  <button key={b} onClick={() => setBudget(b)}
                    className={`px-4 py-2 rounded-full font-sans text-sm font-bold border-2 transition-colors ${budget === b ? "bg-brand-dark text-brand-white border-brand-dark" : "border-brand-dark/20 text-brand-dark hover:border-brand-dark"}`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-brand-dark/50 mb-3">Duration</p>
              <div className="flex flex-wrap gap-2">
                {durations.map((d) => (
                  <button key={d} onClick={() => setDuration(d)}
                    className={`px-4 py-2 rounded-full font-sans text-sm font-bold border-2 transition-colors ${duration === d ? "bg-brand-dark text-brand-white border-brand-dark" : "border-brand-dark/20 text-brand-dark hover:border-brand-dark"}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-brand-dark/50 mb-3">Travel Style</p>
              <div className="flex flex-wrap gap-2">
                {styles.map((s) => (
                  <button key={s} onClick={() => setStyle(s)}
                    className={`px-4 py-2 rounded-full font-sans text-sm font-bold border-2 transition-colors ${style === s ? "bg-brand-blue text-brand-white border-brand-blue" : "border-brand-blue/30 text-brand-blue hover:border-brand-blue"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((itin) => (
              <ItineraryCard key={itin.slug} {...itin} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="font-sans text-brand-dark/50 text-lg">No itineraries found matching your criteria. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </section>

      <NewsletterSignup />
      {footer}
    </main>
  );
}
