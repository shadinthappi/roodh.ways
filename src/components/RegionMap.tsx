"use client";

import React, { useState } from "react";
import { STATES, REGION_COLORS, REGION_INFO } from "./indiaMapData";
import { useRouter } from "next/navigation";

export default function RegionMap() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const router = useRouter();

  const handleMouseEnter = (region: string) => {
    if (region && region !== "Unknown") {
      setHoveredRegion(region);
    }
  };

  const handleMouseLeave = () => {
    setHoveredRegion(null);
  };

  const handleRegionClick = (region: string) => {
    if (region && region !== "Unknown") {
      router.push(`/destinations?region=${encodeURIComponent(region)}`);
    }
  };

  const regionsList = Object.keys(REGION_INFO);

  return (
    <section id="destinations" className="w-full bg-brand-offwhite py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-brand-blue font-sans font-bold uppercase tracking-widest text-sm mb-4">Explore by Region</p>
          <h2 className="font-heading text-5xl md:text-6xl font-black uppercase tracking-tighter text-brand-dark">
            Where Will You Go?
          </h2>
        </div>

        {/* India Map + Region Cards */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Map */}
          <div className="w-full lg:w-1/2 aspect-square max-w-lg mx-auto bg-brand-sand rounded-3xl flex items-center justify-center relative overflow-hidden border-2 border-brand-sand shadow-inner p-4">
            <svg
              viewBox="0 0 612 696"
              className="w-full h-full drop-shadow-xl transition-all duration-500"
              style={{ filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.1))" }}
            >
              {STATES.map((state) => {
                const isHovered = hoveredRegion === state.region;
                const baseColor = REGION_COLORS[state.region] || "#cbd5e1";
                const fillOpacity = hoveredRegion ? (isHovered ? 1 : 0.4) : 0.9;
                
                return (
                  <path
                    key={state.id}
                    d={state.d}
                    fill={baseColor}
                    stroke="#ffffff"
                    strokeWidth={isHovered ? "2.5" : "1.5"}
                    strokeLinejoin="round"
                    style={{
                      fillOpacity,
                      transition: "fill-opacity 0.3s ease, stroke-width 0.3s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={() => handleMouseEnter(state.region)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleRegionClick(state.region)}
                    className="hover:brightness-110"
                  >
                    <title>{`${state.name} (${state.region})`}</title>
                  </path>
                );
              })}
            </svg>
          </div>

          {/* Region Cards Grid */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 md:grid-cols-3 gap-4">
            {regionsList.map((regionName) => {
              const info = REGION_INFO[regionName];
              const color = REGION_COLORS[regionName];
              const isHovered = hoveredRegion === regionName;
              const opacityClass = hoveredRegion
                ? isHovered
                  ? "opacity-100 scale-105 shadow-xl z-10"
                  : "opacity-50 scale-95"
                : "opacity-100 hover:-translate-y-1";
              
              return (
                <button
                  key={regionName}
                  onMouseEnter={() => handleMouseEnter(regionName)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleRegionClick(regionName)}
                  style={{ backgroundColor: color }}
                  className={`text-brand-white p-6 rounded-2xl flex flex-col items-start gap-3 transition-all duration-300 shadow-md text-left ${opacityClass}`}
                >
                  <span className="text-brand-white">
                    {info.icon === "north" && (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 21h18M5 21V10l7-6 7 6v11M9 21v-4a3 3 0 0 1 6 0v4M12 4v4"></path>
                      </svg>
                    )}
                    {info.icon === "south" && (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 22V10M12 10c2-2 5-2 7 0M12 12c-2-2-5-2-7 0M12 10c1.5-3.5 4-5.5 7-5.5M12 12c-1.5-3.5-4-5.5-7-5.5M12 10c0-4 2-7 5-7.5M12 12c0-4-2-7-5-7.5"></path>
                      </svg>
                    )}
                    {info.icon === "east" && (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 2v3M10 2v3M14 2v3"></path>
                      </svg>
                    )}
                    {info.icon === "west" && (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 2L2 22h20L12 2zM12 2v20M2 22c5-3 15-3 20 0"></path>
                      </svg>
                    )}
                    {info.icon === "northeast" && (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 22L12 5l8 17H4zM10 13l2-2.5 3 3.5"></path>
                      </svg>
                    )}
                    {info.icon === "central" && (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm16 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-14 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm14 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"></path>
                      </svg>
                    )}
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-bold uppercase tracking-wide leading-tight">{regionName}</h3>
                    <p className="font-sans text-xs text-brand-white/80 mt-1">{info.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
