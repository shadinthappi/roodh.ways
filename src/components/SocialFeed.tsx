"use client";
import React from "react";
import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/Stagger";

import Image from "next/image";
import { type InstagramPost } from "@/lib/instagram";

const defaultPosts = [
  { tag: "Rajasthan", color: "bg-[#C0392B]" },
  { tag: "Kerala", color: "bg-[#16A085]" },
  { tag: "Ladakh", color: "bg-[#3B2F4A]" },
  { tag: "Goa", color: "bg-[#1A3A4A]" },
  { tag: "Varanasi", color: "bg-[#3D2B1F]" },
  { tag: "Mumbai", color: "bg-[#2C3E50]" },
];

export default function SocialFeed({ instagramUrl, posts = [] }: { instagramUrl?: string, posts?: InstagramPost[] }) {
  const hasLivePosts = posts && posts.length > 0;
  // Pad with default blocks if we don't have exactly 6 posts
  const displayCount = 6;

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

        {/* Grid */}
        <StaggerContainer className="grid grid-cols-3 md:grid-cols-6 gap-3" staggerDelay={0.07}>
          {hasLivePosts ? (
            posts.slice(0, displayCount).map((post) => (
              <StaggerItem key={post.id}>
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block aspect-square rounded-xl overflow-hidden group cursor-pointer relative shadow-md bg-brand-dark/50"
                >
                  <Image 
                    src={post.media_type === "VIDEO" ? (post.thumbnail_url || post.media_url) : post.media_url} 
                    alt={post.caption?.slice(0, 50) || "Instagram post"} 
                    fill 
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg className="w-8 h-8 text-brand-white drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                  </div>
                </a>
              </StaggerItem>
            ))
          ) : (
            defaultPosts.map((post, i) => (
              <StaggerItem key={i}>
                <motion.div
                  className={`${post.color} aspect-square rounded-xl overflow-hidden group cursor-pointer relative shadow-md`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-brand-white/20 font-heading text-xs uppercase tracking-widest text-center px-2">{post.tag}</p>
                  </div>
                  <div className="absolute inset-0 bg-brand-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg className="w-8 h-8 text-brand-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                  </div>
                </motion.div>
              </StaggerItem>
            ))
          )}
        </StaggerContainer>
      </div>
    </section>
  );
}
