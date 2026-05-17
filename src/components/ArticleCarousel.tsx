"use client";
import React, { useRef } from "react";

const articles = [
  { category: "Heritage", title: "The Majestic Forts of Rajasthan", desc: "Explore the golden sandstone fortresses that rise from the Thar Desert.", color: "bg-[#C0392B]" },
  { category: "Nature", title: "Kerala Backwaters: A Houseboat Dream", desc: "Glide through serene lagoons and lush paddy fields on a traditional kettuvallam.", color: "bg-[#16A085]" },
  { category: "Adventure", title: "Biking Through Spiti Valley", desc: "One of the world's most extreme motorcycle routes, through high-altitude Himalayan deserts.", color: "bg-[#7F8C8D]" },
  { category: "Spiritual", title: "Dawn on the Ganges", desc: "Witnessing the morning Ganga Aarti in Varanasi is a transcendental experience.", color: "bg-[#3D2B1F]" },
  { category: "Food & Culture", title: "A Culinary Tour of India", desc: "From butter chicken in Delhi to dosas in Chennai — India is a food lover's paradise.", color: "bg-[#D35400]" },
  { category: "Beaches", title: "Goa Beyond the Beaches", desc: "Spice plantations, Portuguese cathedrals, and hidden jungle waterfalls await.", color: "bg-[#1A3A4A]" },
];

export default function ArticleCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "right" ? 400 : -400, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-brand-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <p className="text-brand-rust font-sans font-bold uppercase tracking-widest text-sm mb-4">Stories & Guides</p>
            <h2 className="font-heading text-5xl md:text-6xl font-black uppercase tracking-tighter text-brand-dark leading-none">
              Explore Your<br />Way
            </h2>
          </div>
          <div className="flex gap-3">
            <button onClick={() => scroll("left")} className="w-12 h-12 rounded-full border-2 border-brand-dark hover:bg-brand-dark hover:text-brand-white flex items-center justify-center transition-colors font-bold text-lg">
              ←
            </button>
            <button onClick={() => scroll("right")} className="w-12 h-12 rounded-full border-2 border-brand-dark hover:bg-brand-dark hover:text-brand-white flex items-center justify-center transition-colors font-bold text-lg">
              →
            </button>
          </div>
        </div>

        {/* Scrollable Cards */}
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 snap-x scroll-smooth" style={{ scrollbarWidth: "none" }}>
          {articles.map((article, i) => (
            <div
              key={i}
              className="snap-start shrink-0 w-[300px] md:w-[360px] rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow"
            >
              {/* Image Placeholder */}
              <div className={`w-full h-56 ${article.color} flex items-center justify-center relative`}>
                <p className="text-brand-white/30 font-heading text-lg uppercase tracking-widest">[ Photo ]</p>
                <span className="absolute top-4 left-4 bg-brand-white/20 backdrop-blur text-brand-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full font-sans">
                  {article.category}
                </span>
              </div>
              {/* Text */}
              <div className="p-6 bg-brand-offwhite group-hover:bg-brand-dark group-hover:text-brand-white transition-colors">
                <h3 className="font-heading text-xl uppercase tracking-wide font-bold mb-2 leading-tight group-hover:text-brand-sand transition-colors">
                  {article.title}
                </h3>
                <p className="font-sans text-sm text-brand-dark/60 group-hover:text-brand-white/70 transition-colors leading-relaxed">
                  {article.desc}
                </p>
                <div className="mt-4 text-brand-rust group-hover:text-brand-sand font-bold font-sans text-sm uppercase tracking-widest transition-colors">
                  Read More →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
