"use client";
import React, { useRef } from "react";

import Image from "next/image";
import { urlFor } from "@/sanity/image";
import Link from "next/link";

interface Story {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverImage?: any;
  themeColor?: string;
  readTime?: string;
}

export default function ArticleCarousel({ stories = [] }: { stories?: Story[] }) {
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
            <p className="text-brand-blue font-sans font-bold uppercase tracking-widest text-sm mb-4">Stories & Guides</p>
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
          {stories.map((article, i) => (
            <div
              key={i}
              className="snap-start shrink-0 w-[300px] md:w-[360px] rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow flex flex-col"
            >
              {/* Image */}
              <div className={`w-full h-56 ${article.themeColor || "bg-brand-blue"} flex items-center justify-center relative shrink-0`}>
                {article.coverImage ? (
                  <Image src={urlFor(article.coverImage).url()} alt={article.title} fill unoptimized className="object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-105 z-0" />
                ) : (
                  <p className="text-brand-white/30 font-heading text-lg uppercase tracking-widest">[ Photo ]</p>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0 opacity-50" />
                <span className="absolute top-4 left-4 z-10 bg-brand-white/20 backdrop-blur text-brand-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full font-sans shadow-sm">
                  {article.category || "Story"}
                </span>
              </div>
              {/* Text */}
              <div className="p-6 bg-brand-offwhite group-hover:bg-brand-dark group-hover:text-brand-white transition-colors flex-grow flex flex-col">
                <h3 className="font-heading text-xl uppercase tracking-wide font-bold mb-2 leading-tight group-hover:text-brand-sand transition-colors">
                  {article.title}
                </h3>
                <p className="font-sans text-sm text-brand-dark/60 group-hover:text-brand-white/70 transition-colors leading-relaxed flex-grow">
                  {article.excerpt || "Read more about this beautiful journey..."}
                </p>
                <Link href={`/stories/${article.slug}`} className="mt-4 text-brand-blue group-hover:text-brand-sand font-bold font-sans text-sm uppercase tracking-widest transition-colors self-start">
                  Read More →
                </Link>
              </div>
            </div>
          ))}
          {stories.length === 0 && (
            <div className="w-full text-center py-12 text-brand-dark/40 font-sans">
              More stories coming soon!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
