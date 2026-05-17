import React from "react";

const regions = [
  { name: "North India", desc: "Delhi · Agra · Jaipur · Varanasi", color: "bg-[#C0392B]", icon: "🏯" },
  { name: "South India", desc: "Kerala · Tamil Nadu · Karnataka", color: "bg-[#16A085]", icon: "🌴" },
  { name: "East India", desc: "Kolkata · Darjeeling · Odisha", color: "bg-[#8E44AD]", icon: "🍵" },
  { name: "West India", desc: "Goa · Mumbai · Rajasthan", color: "bg-[#D35400]", icon: "🎪" },
  { name: "North East", desc: "Assam · Meghalaya · Sikkim", color: "bg-[#27AE60]", icon: "🏔" },
  { name: "Central India", desc: "Madhya Pradesh · Chhattisgarh", color: "bg-[#2980B9]", icon: "🐯" },
];

export default function RegionMap() {
  return (
    <section id="destinations" className="w-full bg-brand-offwhite py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-brand-rust font-sans font-bold uppercase tracking-widest text-sm mb-4">Explore by Region</p>
          <h2 className="font-heading text-5xl md:text-6xl font-black uppercase tracking-tighter text-brand-dark">
            Where Will You Go?
          </h2>
        </div>

        {/* India Map Placeholder + Region Cards */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Map Placeholder */}
          <div className="w-full lg:w-1/2 aspect-square max-w-lg mx-auto bg-brand-sand rounded-3xl flex items-center justify-center relative overflow-hidden border-2 border-brand-sand">
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
              <div className="text-brand-dark/30 font-heading text-6xl">🗺</div>
              <p className="text-brand-dark/40 font-heading text-xl uppercase tracking-widest">Interactive Map</p>
              <p className="text-brand-dark/30 font-sans text-sm">[ India Map Placeholder ]</p>
            </div>
            {/* Decorative dots for regions */}
            {[
              { top: "20%", left: "35%", label: "Delhi" },
              { top: "55%", left: "25%", label: "Mumbai" },
              { top: "70%", left: "40%", label: "Bengaluru" },
              { top: "30%", left: "55%", label: "Kolkata" },
              { top: "15%", left: "45%", label: "Himalaya" },
            ].map((pin) => (
              <div key={pin.label} className="absolute flex flex-col items-center group cursor-pointer" style={{ top: pin.top, left: pin.left }}>
                <div className="w-4 h-4 rounded-full bg-brand-rust border-2 border-brand-white shadow-lg group-hover:scale-150 transition-transform" />
                <span className="mt-1 text-brand-dark font-sans text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-brand-white px-2 py-1 rounded shadow whitespace-nowrap">
                  {pin.label}
                </span>
              </div>
            ))}
          </div>

          {/* Region Cards Grid */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 md:grid-cols-3 gap-4">
            {regions.map((region) => (
              <button
                key={region.name}
                className={`${region.color} text-brand-white p-6 rounded-2xl flex flex-col items-start gap-3 hover:scale-105 transition-transform shadow-md text-left`}
              >
                <span className="text-3xl">{region.icon}</span>
                <div>
                  <h3 className="font-heading text-lg font-bold uppercase tracking-wide leading-tight">{region.name}</h3>
                  <p className="font-sans text-xs text-brand-white/80 mt-1">{region.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
