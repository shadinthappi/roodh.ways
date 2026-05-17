import React from "react";

const destinations = [
  { name: "Rajasthan", tag: "The Pink City", color: "bg-[#C0392B]" },
  { name: "Kerala", tag: "God's Own Country", color: "bg-[#16A085]" },
  { name: "Ladakh", tag: "Land of High Passes", color: "bg-[#7F8C8D]" },
  { name: "Goa", tag: "Sun, Sea & Spice", color: "bg-[#1A3A4A]" },
];

export default function DestinationStrips() {
  return (
    <section className="w-full bg-brand-offwhite py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-brand-rust font-sans font-bold uppercase tracking-widest text-sm mb-4">Featured Places</p>
          <h2 className="font-heading text-5xl md:text-6xl font-black uppercase tracking-tighter text-brand-dark">
            Top Destinations
          </h2>
        </div>

        {/* Four vertical strip cards */}
        <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[600px]">
          {destinations.map((dest, i) => (
            <div
              key={i}
              className={`relative ${dest.color} flex-1 rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:flex-[2] transition-all duration-500`}
            >
              {/* Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-brand-white/20 font-heading text-lg uppercase tracking-widest writing-vertical text-center">[ Photo ]</p>
              </div>

              {/* Map pin */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <div className="w-5 h-5 rounded-full bg-brand-white border-2 border-brand-rust shadow" />
                <div className="w-0.5 h-8 bg-brand-white/50" />
              </div>

              {/* Bottom text */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-brand-dark/90 to-transparent flex flex-col items-center text-center">
                <h3 className="font-heading text-2xl md:text-3xl font-black uppercase tracking-tight text-brand-white">
                  {dest.name}
                </h3>
                <p className="font-sans text-brand-sand text-sm uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {dest.tag}
                </p>
                <button className="mt-4 bg-brand-white text-brand-dark text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-brand-sand">
                  Explore →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
