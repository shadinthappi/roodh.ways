"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { urlFor } from "@/sanity/image";

interface ExperienceTileProps {
  slug: string;
  name: string;
  tagline: string;
  color: string;
  description: string;
  mainImage?: any;
}

export default function ExperienceTile({ slug, name, tagline, color, description, mainImage }: ExperienceTileProps) {
  const isHexColor = color?.startsWith("#");
  const bgClass = isHexColor ? "" : (color || "bg-brand-dark");
  const bgStyle = isHexColor ? { backgroundColor: color } : {};

  return (
    <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ duration: 0.25, ease: "easeOut" }}>
      <Link
        href={`/experiences/${slug}`}
        className={`group relative ${bgClass} rounded-2xl overflow-hidden p-8 flex flex-col justify-between min-h-[340px] shadow-lg cursor-pointer block`}
        style={bgStyle}
      >
        {/* Background image if exists */}
        {mainImage && (
          <>
            <Image
              src={urlFor(mainImage).url()}
              alt={name}
              fill
              unoptimized
              className="object-cover absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-500"
            />
            {/* Elegant gradient overlay to ensure text contrast while keeping image clear */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/30 to-brand-dark/15 z-0" />
          </>
        )}

        {/* Spacer to replace icon and push contents to bottom */}
        <div className="h-12 relative z-10" />

        {/* Bottom content */}
        <div className="relative z-10">
          <p className="font-sans text-brand-white/80 text-xs font-bold uppercase tracking-widest mb-2">{tagline}</p>
          <h3 className="font-heading text-3xl font-black uppercase tracking-tight text-brand-white leading-tight mb-3">
            {name}
          </h3>
          <p className="font-sans text-brand-white/90 text-sm leading-relaxed line-clamp-2">{description}</p>
          <div className="mt-6 text-brand-white font-sans text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Explore →
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-brand-white/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
      </Link>
    </motion.div>
  );
}
