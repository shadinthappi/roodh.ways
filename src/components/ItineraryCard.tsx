import React from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import Link from "next/link";

interface ItineraryCardProps {
  title: string;
  slug?: string;
  duration: string;
  style: string;
  budget: string;
  group: string;
  stops: string[];
  themeColor?: string;
  color?: string; // fallback
  description: string;
  coverImage?: any;
  basePath?: string;
  price?: string;
}

export default function ItineraryCard({ title, slug, duration, style, budget, group, stops, themeColor, color, description, coverImage, basePath = "/plan", price }: ItineraryCardProps) {
  const cardColor = themeColor || color || "bg-brand-blue";
  
  return (
    <div className="bg-brand-offwhite rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group flex flex-col h-full">
      {/* Color header */}
      <div className={`${cardColor} h-48 relative flex items-end p-6 shrink-0`}>
        {coverImage && (
          <>
            <Image src={urlFor(coverImage).url()} alt={title} fill unoptimized className="object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-105 z-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0" />
          </>
        )}
        {!coverImage && (
          <>
            <div className="absolute inset-0 bg-black/10 z-0">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-20 text-brand-white mix-blend-overlay">
                <defs>
                  <pattern id="topo" width="80" height="80" patternUnits="userSpaceOnUse">
                    <path d="M0 40 Q 20 20, 40 40 T 80 40" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M0 60 Q 20 40, 40 60 T 80 60" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7" />
                    <path d="M0 20 Q 20 0, 40 20 T 80 20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#topo)" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0" />
          </>
        )}
        {/* Stop pills */}
        <div className="relative z-10 flex flex-wrap gap-2">
          {stops?.map((stop, i) => (
            <span key={i} className="bg-brand-white/20 backdrop-blur text-brand-white text-xs font-bold px-3 py-1 rounded-full font-sans">
              {stop}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 group-hover:bg-brand-dark transition-colors duration-300 flex flex-col flex-grow">
        <div className="flex gap-4 text-xs font-bold uppercase tracking-widest font-sans text-brand-blue group-hover:text-brand-sand transition-colors mb-3 flex-wrap">
          <span>{duration}</span>
          <span>·</span>
          <span>{style}</span>
          <span>·</span>
          <span>{budget}</span>
        </div>
        <h3 className="font-heading text-2xl font-black uppercase tracking-tight text-brand-dark group-hover:text-brand-white transition-colors mb-2">
          {title}
        </h3>
        {price && (
          <div className="font-sans font-bold text-sm text-brand-dark/80 group-hover:text-brand-white/80 transition-colors mb-3">
            Starting from <span className="text-brand-blue group-hover:text-brand-sand transition-colors">₹{price}</span>
          </div>
        )}
        <p className="font-sans text-sm text-brand-dark/60 group-hover:text-brand-white/60 transition-colors leading-relaxed mb-4 flex-grow">
          {description}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <span className="font-sans text-xs text-brand-dark/40 group-hover:text-brand-white/40 transition-colors">{group}</span>
          {slug ? (
            <Link href={`${basePath}/${slug}`} className="font-sans text-xs font-bold uppercase tracking-widest text-brand-blue group-hover:text-brand-sand transition-colors">
              View Itinerary →
            </Link>
          ) : (
            <button className="font-sans text-xs font-bold uppercase tracking-widest text-brand-blue group-hover:text-brand-sand transition-colors">
              View Itinerary →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
