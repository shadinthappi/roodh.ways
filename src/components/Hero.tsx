"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { urlFor } from "@/sanity/image";
import Image from "next/image";
import Link from "next/link";

const hardcodedSlides = [
  {
    tag: "Heritage & History",
    heading: "THE GOLDEN\nTRIANGLE",
    subheading: "Delhi · Agra · Jaipur",
    slug: "golden-triangle",
    cta: "Explore Heritage",
    bg: "bg-[#2C3E50]",
    image: null,
  },
  {
    tag: "Nature & Serenity",
    heading: "KERALA\nBACKWATERS",
    subheading: "God's Own Country",
    slug: "kerala",
    cta: "Discover South India",
    bg: "bg-[#1B4D3E]",
    image: null,
  },
  {
    tag: "Adventure",
    heading: "HIMALAYAN\nHIGHS",
    subheading: "Leh · Ladakh · Spiti",
    slug: "himalayas",
    cta: "Plan Your Trek",
    bg: "bg-[#3B2F4A]",
    image: null,
  },
  {
    tag: "Beaches & Coast",
    heading: "GOA\nSUNSHINE",
    subheading: "Beaches · Culture · Nightlife",
    slug: "goa",
    cta: "See Coastal India",
    bg: "bg-[#1A3A4A]",
    image: null,
  },
  {
    tag: "Spirituality",
    heading: "VARANASI\nTHE ETERNAL",
    subheading: "India's Oldest Living City",
    slug: "varanasi",
    cta: "Experience Varanasi",
    bg: "bg-[#3D2B1F]",
    image: null,
  },
];

const colors = ["bg-[#2C3E50]", "bg-[#1B4D3E]", "bg-[#3B2F4A]", "bg-[#1A3A4A]", "bg-[#3D2B1F]"];

export default function Hero({ featuredDestinations }: { featuredDestinations?: any[] }) {
  const [current, setCurrent] = useState(0);

  const slides = featuredDestinations && featuredDestinations.length > 0 
    ? featuredDestinations.map((dest, idx) => ({
        tag: dest.categories?.[0] || dest.region || "Destination",
        heading: dest.name.replace(" ", "\n"), // simple split for styling
        subheading: dest.tagline || dest.region,
        slug: dest.slug,
        cta: "Explore " + dest.name,
        bg: colors[idx % colors.length],
        image: dest.mainImage,
      }))
    : hardcodedSlides;

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="w-full h-screen min-h-[700px] relative flex flex-col justify-center pt-[108px] overflow-hidden">
      
      {/* Background Image — smooth crossfade (no wait, layers overlap during transition) */}
      <AnimatePresence>
        <motion.div
          key={`bg-${current}`}
          className={`absolute inset-0 ${slide.bg} z-0`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {slide.image ? (
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6, ease: "easeOut" }}
            >
              <Image 
                src={urlFor(slide.image).url()} 
                alt={slide.heading.replace("\n", " ")} 
                fill unoptimized 
                className="object-cover transition-opacity duration-1000"
              />
            </motion.div>
          ) : (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6, ease: "easeOut" }}
            >
              <div className="text-brand-white/10 font-heading text-4xl md:text-6xl uppercase tracking-widest text-center z-10 whitespace-nowrap overflow-hidden">
                {slide.heading.replace("\n", " ")}
              </div>
            </motion.div>
          )}
          {/* Dark gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent z-10" />
        </motion.div>
      </AnimatePresence>

      {/* Foreground: Text Panel — staggered entrance */}
      <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col justify-center px-10 md:px-20 py-16 relative z-20 h-full">
        
        {/* Slide counter — always visible, smoothly updates */}
        <motion.div
          key={`counter-${current}`}
          className="text-brand-sand/80 font-sans text-sm uppercase tracking-widest mb-6 font-bold drop-shadow"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </motion.div>

        {/* Animated slide content — staggered children */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
              exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
            }}
          >
            {/* Tag */}
            <motion.div 
              className="text-brand-blue font-sans font-bold uppercase tracking-widest text-sm mb-4 drop-shadow"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
              }}
            >
              {slide.tag}
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              className="font-heading font-black text-6xl md:text-8xl lg:text-9xl leading-[0.9] text-brand-white uppercase tracking-tighter mb-6 whitespace-pre-line drop-shadow-2xl"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
                exit: { opacity: 0, y: -15, transition: { duration: 0.3 } },
              }}
            >
              {slide.heading}
            </motion.h1>

            {/* Subheading */}
            <motion.p 
              className="font-sans text-brand-sand text-lg md:text-xl mb-10 drop-shadow max-w-lg"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
              }}
            >
              {slide.subheading}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap gap-4 mb-16"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                exit: { opacity: 0, transition: { duration: 0.15 } },
              }}
            >
              <Link href={`/destinations/${slide.slug}`} className="bg-brand-blue hover:bg-brand-blue/80 text-brand-white px-8 py-4 rounded-full font-heading uppercase tracking-wider text-base font-bold transition-colors shadow-lg">
                {slide.cta}
              </Link>
              <Link href="/plan" className="bg-brand-dark/50 backdrop-blur-sm border border-brand-white/40 hover:border-brand-sand text-brand-white px-8 py-4 rounded-full font-heading uppercase tracking-wider text-base font-bold transition-colors flex items-center justify-center gap-2 shadow-lg">
                Build Itinerary
                <svg className="w-4 h-4 text-brand-sand" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h2M6.34 17.66l-2.83-2.83M20.57 3.43l-2.83 2.83M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next controls */}
        <div className="flex items-center gap-4 mt-auto md:mt-0">
          <button onClick={prev} aria-label="Previous" className="w-12 h-12 rounded-full border border-brand-white/40 hover:border-brand-sand bg-brand-dark/30 backdrop-blur-sm flex items-center justify-center text-brand-white hover:text-brand-sand transition-colors">
            ←
          </button>
          <button onClick={next} aria-label="Next" className="w-12 h-12 rounded-full border border-brand-white/40 hover:border-brand-sand bg-brand-dark/30 backdrop-blur-sm flex items-center justify-center text-brand-white hover:text-brand-sand transition-colors">
            →
          </button>
          {/* Dot indicators */}
          <div className="flex gap-2 ml-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-brand-sand w-6 shadow-[0_0_8px_rgba(235,212,185,0.8)]" : "w-2 bg-brand-white/40"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>

  );
}

