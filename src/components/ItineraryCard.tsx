import React from "react";

interface ItineraryCardProps {
  title: string;
  duration: string;
  style: string;
  budget: string;
  group: string;
  stops: string[];
  color: string;
  description: string;
}

export default function ItineraryCard({ title, duration, style, budget, group, stops, color, description }: ItineraryCardProps) {
  return (
    <div className="bg-brand-offwhite rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
      {/* Color header */}
      <div className={`${color} h-48 relative flex items-end p-6`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-brand-white/20 font-heading text-lg uppercase tracking-widest">[ Map ]</p>
        </div>
        {/* Stop pills */}
        <div className="relative z-10 flex flex-wrap gap-2">
          {stops.map((stop, i) => (
            <span key={i} className="bg-brand-white/20 backdrop-blur text-brand-white text-xs font-bold px-3 py-1 rounded-full font-sans">
              {stop}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 group-hover:bg-brand-dark transition-colors duration-300">
        <div className="flex gap-4 text-xs font-bold uppercase tracking-widest font-sans text-brand-rust group-hover:text-brand-sand transition-colors mb-3 flex-wrap">
          <span>{duration}</span>
          <span>·</span>
          <span>{style}</span>
          <span>·</span>
          <span>{budget}</span>
        </div>
        <h3 className="font-heading text-2xl font-black uppercase tracking-tight text-brand-dark group-hover:text-brand-white transition-colors mb-2">
          {title}
        </h3>
        <p className="font-sans text-sm text-brand-dark/60 group-hover:text-brand-white/60 transition-colors leading-relaxed mb-4">
          {description}
        </p>
        <div className="flex justify-between items-center">
          <span className="font-sans text-xs text-brand-dark/40 group-hover:text-brand-white/40 transition-colors">{group}</span>
          <button className="font-sans text-xs font-bold uppercase tracking-widest text-brand-rust group-hover:text-brand-sand transition-colors">
            View Itinerary →
          </button>
        </div>
      </div>
    </div>
  );
}
