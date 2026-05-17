"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";


interface DestinationCardProps {
  slug: string;
  name: string;
  tagline: string;
  region: string;
  categories: string[];
  color: string;
}

export default function DestinationCard({ slug, name, tagline, region, categories, color }: DestinationCardProps) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25, ease: "easeOut" }}>
      <Link href={`/destinations/${slug}`} className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow bg-brand-offwhite">
        {/* Image Placeholder */}
        <div className={`w-full h-56 ${color} relative flex items-center justify-center`}>
          <p className="text-brand-white/20 font-heading text-lg uppercase tracking-widest">[ Photo ]</p>
          <span className="absolute top-4 left-4 bg-brand-white/20 backdrop-blur text-brand-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full font-sans">
            {region}
          </span>
        </div>
        {/* Content */}
        <div className="p-6 group-hover:bg-brand-dark transition-colors duration-300">
          <div className="flex gap-2 flex-wrap mb-3">
            {categories.map((cat) => (
              <span key={cat} className="text-brand-rust group-hover:text-brand-sand text-xs font-bold uppercase tracking-widest font-sans transition-colors">{cat}</span>
            ))}
          </div>
          <h2 className="font-heading text-2xl font-black uppercase tracking-tight text-brand-dark group-hover:text-brand-white transition-colors mb-1">
            {name}
          </h2>
          <p className="font-sans text-brand-dark/50 group-hover:text-brand-white/60 text-sm transition-colors mb-4">{tagline}</p>
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-brand-rust group-hover:text-brand-sand transition-colors">
            Discover →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

