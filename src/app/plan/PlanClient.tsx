"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ItineraryCard from "@/components/ItineraryCard";
import NewsletterSignup from "@/components/NewsletterSignup";

const steps = [
  { number: "01", title: "Choose Your Destination", desc: "Browse our curated list of Indian destinations. Filter by region, category, or travel style to find your perfect match." },
  { number: "02", title: "Pick Your Experiences", desc: "Layer on the experiences that matter to you — heritage, adventure, food, wildlife, or spiritual journeys." },
  { number: "03", title: "Build Your Itinerary", desc: "Our AI-powered planner assembles a day-by-day itinerary tailored to your budget, group, and timeframe." },
];

const budgets = ["Any Budget", "Budget-Friendly", "Mid-Range", "Luxury", "Premium"];
const durations = ["Any Duration", "3–5 Days", "6–8 Days", "9–12 Days", "2+ Weeks"];
const styles = ["Any Style", "Heritage", "Adventure", "Nature", "Beach", "Spiritual", "Food & Culture"];

export default function PlanClient({ itineraries }: { itineraries: any[] }) {
  const [budget, setBudget] = useState("Any Budget");
  const [duration, setDuration] = useState("Any Duration");
  const [style, setStyle] = useState("Any Style");
  const [aiPrompt, setAiPrompt] = useState("");

  const filtered = itineraries.filter((itin) => {
    const bMatch = budget === "Any Budget" || itin.budget === budget;
    const dMatch = duration === "Any Duration" || itin.duration === duration;
    const sMatch = style === "Any Style" || itin.style === style;
    return bMatch && dMatch && sMatch;
  });

  return (
    <main className="min-h-screen bg-brand-white">
      <Header />

      {/* Hero */}
      <section className="w-full bg-brand-dark pt-36 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #B85C38 0%, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-1">
            <p className="text-brand-rust font-sans font-bold uppercase tracking-widest text-sm mb-6">Your Journey Awaits</p>
            <h1 className="font-heading font-black text-6xl md:text-8xl uppercase tracking-tighter text-brand-white leading-none mb-8">
              Plan<br />Your Trip
            </h1>
            <p className="font-sans text-brand-white/60 text-lg leading-relaxed max-w-xl">
              Tell us what you love and we will craft the perfect India itinerary for you. From 3-day getaways to month-long explorations — every journey starts here.
            </p>
          </div>

          {/* AI Planner Box */}
          <div className="w-full md:w-[420px] bg-brand-white/5 border border-brand-white/10 backdrop-blur-sm p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">✨</span>
              <h2 className="font-heading text-2xl font-bold uppercase text-brand-white">AI Trip Planner</h2>
            </div>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder={`"I want a 10-day trip to South India focused on nature and backwaters, with a mid-range budget for 2 people..."`}
              rows={5}
              className="w-full bg-brand-white/10 border border-brand-white/20 text-brand-white placeholder-brand-white/30 p-4 rounded-xl font-sans text-sm leading-relaxed focus:outline-none focus:border-brand-sand resize-none mb-4"
            />
            <button className="w-full bg-brand-rust hover:bg-brand-rust/80 text-brand-white py-3 rounded-xl font-heading uppercase tracking-wider font-bold transition-colors">
              Generate Itinerary ✨
            </button>
            <p className="text-brand-white/30 text-xs font-sans mt-3 text-center">AI Planner — coming soon</p>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="bg-brand-offwhite py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-5xl uppercase font-black tracking-tighter text-brand-dark mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col gap-4">
                <div className="font-heading text-8xl font-black text-brand-rust/20 leading-none">{step.number}</div>
                <h3 className="font-heading text-2xl font-bold uppercase tracking-tight text-brand-dark">{step.title}</h3>
                <p className="font-sans text-brand-dark/60 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Form */}
      <section className="bg-brand-white py-20 px-6 border-t border-brand-dark/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-5xl uppercase font-black tracking-tighter text-brand-dark mb-4">Filter Itineraries</h2>
          <p className="font-sans text-brand-dark/50 mb-10">Narrow down the suggested itineraries by your preferences.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Budget */}
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
            {/* Duration */}
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
            {/* Style */}
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-brand-dark/50 mb-3">Travel Style</p>
              <div className="flex flex-wrap gap-2">
                {styles.map((s) => (
                  <button key={s} onClick={() => setStyle(s)}
                    className={`px-4 py-2 rounded-full font-sans text-sm font-bold border-2 transition-colors ${style === s ? "bg-brand-rust text-brand-white border-brand-rust" : "border-brand-rust/30 text-brand-rust hover:border-brand-rust"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Itinerary Cards */}
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
      <Footer />
    </main>
  );
}
