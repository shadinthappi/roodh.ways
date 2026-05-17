"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";


interface ExperienceTileProps {
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  color: string;
  description: string;
}

export default function ExperienceTile({ slug, name, tagline, icon, color, description }: ExperienceTileProps) {
  return (
    <motion.div whileHover={{ scale: 1.03, y: -4 }} transition={{ duration: 0.25, ease: "easeOut" }}>
      <Link href={`/experiences/${slug}`} className={`group relative ${color} rounded-2xl overflow-hidden p-8 flex flex-col justify-between min-h-[340px] shadow-lg cursor-pointer block`}>
        {/* Icon */}
        <div className="text-5xl mb-4">{icon}</div>

        {/* Bottom content */}
        <div>
          <p className="font-sans text-brand-white/60 text-xs font-bold uppercase tracking-widest mb-2">{tagline}</p>
          <h3 className="font-heading text-3xl font-black uppercase tracking-tight text-brand-white leading-tight mb-3">
            {name}
          </h3>
          <p className="font-sans text-brand-white/70 text-sm leading-relaxed line-clamp-2">{description}</p>
          <div className="mt-6 text-brand-white font-sans text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Explore →
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-brand-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
    </motion.div>
  );
}
