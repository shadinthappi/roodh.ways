"use client";

import React, { useState, useEffect, Suspense } from "react";
import DestinationCard from "@/components/DestinationCard";
import { StaggerContainer, StaggerItem } from "@/components/Stagger";
import { useSearchParams, useRouter } from "next/navigation";

const regions = ["All", "North India", "South India", "East India", "West India", "North East", "Central India"];
const categories = ["Heritage", "Nature", "Adventure", "Beach", "Spiritual", "Culture", "Food"];

function DestinationsContent({ destinations }: { destinations: any[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeRegion, setActiveRegion] = useState("All");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const region = searchParams.get("region");
    if (region && regions.includes(region)) {
      setActiveRegion(region);
    } else {
      setActiveRegion("All");
    }
  }, [searchParams]);

  const handleRegionClick = (r: string) => {
    setActiveRegion(r);
    const params = new URLSearchParams(searchParams.toString());
    if (r === "All") params.delete("region");
    else params.set("region", r);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleCategoryClick = (c: string) => {
    const newCat = activeCategory === c ? null : c;
    setActiveCategory(newCat);
  };

  const filtered = destinations.filter((d) => {
    const regionMatch = activeRegion === "All" || d.region === activeRegion;
    const catMatch = !activeCategory || (d.categories && d.categories.includes(activeCategory));
    return regionMatch && catMatch;
  });

  return (
    <>
      {/* Filter Bar */}
      <section className="bg-brand-white sticky top-[108px] z-40 border-b border-brand-dark/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {/* Region filters */}
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => handleRegionClick(r)}
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
              onClick={() => handleCategoryClick(c)}
              className={`shrink-0 px-5 py-2 rounded-full font-sans font-bold text-sm uppercase tracking-wider border-2 transition-colors ${
                activeCategory === c
                  ? "bg-brand-blue text-brand-white border-brand-blue"
                  : "border-brand-blue/30 text-brand-blue hover:border-brand-blue"
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
    </>
  );
}

export default function DestinationsClient({ destinations }: { destinations: any[] }) {
  return (
    <Suspense fallback={<div className="py-24 text-center">Loading destinations...</div>}>
      <DestinationsContent destinations={destinations} />
    </Suspense>
  );
}
