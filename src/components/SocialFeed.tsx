"use client";
import React from "react";
import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/Stagger";


import { urlFor } from "@/sanity/image";
import Image from "next/image";

const posts = [
  { tag: "Rajasthan", color: "bg-[#C0392B]" },
  { tag: "Kerala", color: "bg-[#16A085]" },
  { tag: "Ladakh", color: "bg-[#3B2F4A]" },
  { tag: "Goa", color: "bg-[#1A3A4A]" },
  { tag: "Varanasi", color: "bg-[#3D2B1F]" },
  { tag: "Mumbai", color: "bg-[#2C3E50]" },
];

interface FeedImage {
  image: any;
  tag?: string;
  color?: string;
}

export default function SocialFeed({ instagramUrl, feedImages }: { instagramUrl?: string, feedImages?: FeedImage[] }) {
  const displayPosts = feedImages && feedImages.length > 0 ? feedImages : posts;

  const getBentoClass = (index: number) => {
    const i = index % 6;
    if (i === 0) return "md:col-span-2 md:row-span-2 min-h-[300px] md:min-h-0"; // Large square
    if (i >= 1 && i <= 4) return "md:col-span-1 md:row-span-1 min-h-[150px] md:min-h-0"; // Small squares
    if (i === 5) return "md:col-span-4 md:row-span-1 min-h-[200px] md:min-h-[250px]"; // Wide rectangle
    return "md:col-span-1 md:row-span-1";
  };

  return (
    <section className="w-full bg-brand-dark py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <FadeIn delay={0}>
              <p className="text-brand-blue font-sans font-bold uppercase tracking-widest text-sm mb-4">#RoodhWays</p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="font-heading text-5xl md:text-6xl font-black uppercase tracking-tighter text-brand-white leading-none">
                Join the<br />Adventure
              </h2>
            </FadeIn>
          </div>
          <FadeIn delay={0.2} direction="left">
            <a href={instagramUrl || "https://instagram.com"} target="_blank" rel="noopener noreferrer"
              className="border-2 border-brand-white text-brand-white px-8 py-3 rounded-full font-heading uppercase tracking-wider font-bold hover:bg-brand-white hover:text-brand-dark transition-colors">
              Follow on Instagram
            </a>
          </FadeIn>
        </div>

        {/* Bento Grid */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-fr" staggerDelay={0.07}>
          {displayPosts.map((post, i) => (
            <StaggerItem key={i} className={getBentoClass(i)}>
              <motion.div
                className={`${post.color || "bg-brand-blue"} w-full h-full rounded-2xl overflow-hidden group cursor-pointer relative shadow-lg`}
                whileHover={{ scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {post.image ? (
                  <Image 
                    src={urlFor(post.image).url()} 
                    alt={post.tag || "Social Feed"} 
                    fill 
                    unoptimized 
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110" 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-brand-white/20 font-heading text-xs uppercase tracking-widest text-center px-2">{post.tag}</p>
                  </div>
                )}
                
                {/* Overlay that appears on hover */}
                <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-sm">
                  <div className="flex flex-col items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <svg className="w-10 h-10 text-brand-white mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                    {post.tag && <span className="font-heading font-bold text-lg uppercase tracking-wider text-brand-white drop-shadow-md">{post.tag}</span>}
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
