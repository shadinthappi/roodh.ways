"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/Stagger";

export default function SocialFeed({ instagramUrl }: { instagramUrl?: string }) {
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await fetch("https://feeds.behold.so/MKhMVFueh4ZDhCn5PWBG");
        const data = await res.json();
        if (data && data.posts) {
          setFeed(data.posts.slice(0, 6));
        }
      } catch (error) {
        console.error("Failed to fetch Instagram feed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  const displayPosts = loading || feed.length === 0 
    ? Array(6).fill({ isSkeleton: true }) 
    : feed;

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
            <a href={instagramUrl || "https://instagram.com/roodh.ways"} target="_blank" rel="noopener noreferrer"
              className="border-2 border-brand-white text-brand-white px-8 py-3 rounded-full font-heading uppercase tracking-wider font-bold hover:bg-brand-white hover:text-brand-dark transition-colors">
              Follow on Instagram
            </a>
          </FadeIn>
        </div>

        {/* Grid */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3" staggerDelay={0.07}>
          {displayPosts.map((post, i) => {
            const isSkeleton = post.isSkeleton;
            const imageUrl = !isSkeleton ? (post.sizes?.large?.mediaUrl || post.mediaUrl) : null;
            const linkUrl = !isSkeleton ? post.permalink : "#";
            const bgColor = !isSkeleton && post.colorPalette?.dominant ? `rgb(${post.colorPalette.dominant})` : "#1a1a1a";

            return (
              <StaggerItem key={i}>
                {isSkeleton ? (
                  <div className="aspect-square rounded-xl bg-brand-white/5 animate-pulse" />
                ) : (
                  <motion.a
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-square rounded-xl overflow-hidden group cursor-pointer relative shadow-md"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    style={{ backgroundColor: bgColor }}
                  >
                    {imageUrl && (
                      <img 
                        src={imageUrl} 
                        alt={post.prunedCaption || "Instagram post"} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-brand-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <svg className="w-8 h-8 text-brand-white drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                        <circle cx="12" cy="13" r="4"></circle>
                      </svg>
                    </div>
                  </motion.a>
                )}
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
