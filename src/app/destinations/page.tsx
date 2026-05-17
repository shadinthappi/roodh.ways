"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import DestinationCard from "@/components/DestinationCard";
import { StaggerContainer, StaggerItem } from "@/components/Stagger";
import { destinations } from "@/data/destinations";

const regions = ["All", "North India", "South India", "East India", "West India", "Islands"];
const categories = ["Heritage", "Nature", "Adventure", "Beach", "Spiritual", "Culture", "Food"];

export default function DestinationsPage() {
  const [activeRegion, setActiveRegion] = useState("All");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = destinations.filter((d) => {
    const regionMatch = activeRegion === "All" || d.region === activeRegion;
    const catMatch = !activeCategory || d.categories.includes(activeCategory);
    return regionMatch && catMatch;
  });

  return (
    <main className="min-h-screen bg-brand-white">
      <Header />
      <PageHero
        label="Explore India"
        heading="Destinations"
        subheading="From the heights of the Himalayas to the shores of the Indian Ocean — find your perfect place."
      />

      {/* Filter Bar */}
      <section className="bg-brand-white sticky top-[108px] z-40 border-b border-brand-dark/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {/* Region filters */}
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRegion(r)}
              className={`shrink-0 px-5 py-2 rounded-full font-sans font-bold text-sm uppercase tracking-wider border-2 transition-colors ${
                activeRegion === r
                  ? "bg-brand-dark text-brand-white border-brand-dark"
                  : "border-brand-dark/20 text-brand-dark hover:border-brand-dark"
              }`}
            >
              {r}
            </button>
          ))}
          <div className="w-px h-8 bg-brand-dark/10 shrink-0 self-center mx-1" />
          {/* Category filters */}
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(activeCategory === c ? null : c)}
              className={`shrink-0 px-5 py-2 rounded-full font-sans font-bold text-sm uppercase tracking-wider border-2 transition-colors ${
                activeCategory === c
                  ? "bg-brand-rust text-brand-white border-brand-rust"
                  : "border-brand-rust/30 text-brand-rust hover:border-brand-rust"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-brand-dark/40 font-sans text-lg">
            No destinations match your filters. Try clearing some filters.
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((dest) => (
              <StaggerItem key={dest.slug}>
                <DestinationCard {...dest} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>

      <Footer />
    </main>
  );
}
