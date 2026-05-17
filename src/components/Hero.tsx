"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    tag: "Heritage & History",
    heading: "THE GOLDEN\nTRIANGLE",
    subheading: "Delhi · Agra · Jaipur",
    cta: "Explore Heritage",
    bg: "bg-[#2C3E50]",
  },
  {
    tag: "Nature & Serenity",
    heading: "KERALA\nBACKWATERS",
    subheading: "God's Own Country",
    cta: "Discover South India",
    bg: "bg-[#1B4D3E]",
  },
  {
    tag: "Adventure",
    heading: "HIMALAYAN\nHIGHS",
    subheading: "Leh · Ladakh · Spiti",
    cta: "Plan Your Trek",
    bg: "bg-[#3B2F4A]",
  },
  {
    tag: "Beaches & Coast",
    heading: "GOA\nSUNSHINE",
    subheading: "Beaches · Culture · Nightlife",
    cta: "See Coastal India",
    bg: "bg-[#1A3A4A]",
  },
  {
    tag: "Spirituality",
    heading: "VARANASI\nTHE ETERNAL",
    subheading: "India's Oldest Living City",
    cta: "Experience Varanasi",
    bg: "bg-[#3D2B1F]",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="w-full h-screen min-h-[700px] flex flex-col md:flex-row bg-brand-dark pt-[108px]">
      {/* Left: Text Panel */}
      <div className="w-full md:w-1/2 bg-brand-dark flex flex-col justify-center px-10 md:px-20 py-16 relative overflow-hidden">
        {/* Slide counter */}
        <motion.div
          className="text-brand-sand/60 font-sans text-sm uppercase tracking-widest mb-6 font-bold"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        >
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </motion.div>

        {/* Animated slide content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Tag */}
            <div className="text-brand-rust font-sans font-bold uppercase tracking-widest text-sm mb-4">
              {slide.tag}
            </div>

            {/* Main Heading */}
            <h1 className="font-heading font-black text-5xl md:text-7xl lg:text-8xl leading-none text-brand-white uppercase tracking-tighter mb-6 whitespace-pre-line">
              {slide.heading}
            </h1>

            {/* Subheading */}
            <p className="font-sans text-brand-sand text-lg md:text-xl mb-10">
              {slide.subheading}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-16">
              <button className="bg-brand-rust hover:bg-brand-rust/80 text-brand-white px-8 py-3 rounded-full font-heading uppercase tracking-wider text-base font-bold transition-colors">
                {slide.cta}
              </button>
              <button className="border-2 border-brand-white/40 hover:border-brand-sand text-brand-white px-8 py-3 rounded-full font-heading uppercase tracking-wider text-base font-bold transition-colors">
                Build Itinerary ✨
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next controls */}
        <div className="flex items-center gap-4">
          <button onClick={prev} aria-label="Previous" className="w-12 h-12 rounded-full border border-brand-white/30 hover:border-brand-sand flex items-center justify-center text-brand-white hover:text-brand-sand transition-colors">
            ←
          </button>
          <button onClick={next} aria-label="Next" className="w-12 h-12 rounded-full border border-brand-white/30 hover:border-brand-sand flex items-center justify-center text-brand-white hover:text-brand-sand transition-colors">
            →
          </button>
          {/* Dot indicators */}
          <div className="flex gap-2 ml-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-brand-sand w-6" : "w-2 bg-brand-white/30"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right: Image Placeholder Panel — crossfades on slide change */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${current}`}
          className={`w-full md:w-1/2 ${slide.bg} relative overflow-hidden flex items-end`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-brand-white/20 font-heading text-4xl uppercase tracking-widest text-center">
              [ Image Placeholder ]<br/>
              <span className="text-lg">{slide.heading.replace("\n", " ")}</span>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent" />
          <div className="relative z-10 p-10 text-brand-white">
            <span className="font-sans text-sm uppercase tracking-widest text-brand-sand font-bold">{slide.subheading}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>

  );
}

