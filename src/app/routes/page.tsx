import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { sanityFetch } from "@/sanity/client";
import { groq } from "next-sanity";
import { urlFor } from "@/sanity/image";
import Image from "next/image";

export const revalidate = 60; // revalidate every minute

export default async function RoutesPage() {
  const query = groq`*[_type == "route" && isPublished == true] | order(name asc) {
    name,
    "slug": slug.current,
    tagline,
    difficulty,
    color,
    description,
    duration,
    distance,
    bestTime,
    mainImage
  }`;
  
  const routes = await sanityFetch<any[]>(query);

  return (
    <main className="min-h-screen bg-brand-white">
      <Header />
      <PageHero
        label="Scenic Routes"
        heading="Drive India"
        subheading="Some of the world's most spectacular journeys unfold on Indian roads. Choose your route and start driving."
      />

      {/* Intro */}
      <section className="bg-brand-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-sans text-brand-dark/70 text-lg md:text-xl leading-relaxed">
            India's roads take you through landscapes found nowhere else — from Himalayan high passes to coastal jungle tracks. These curated scenic routes are crafted for travellers who believe the journey is the destination.
          </p>
        </div>
      </section>

      {/* Route Cards */}
      <section className="bg-brand-offwhite py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          {routes.map((route, i) => (
            <Link
              key={route.slug}
              href={`/routes/${route.slug}`}
              className="group flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow bg-brand-white"
            >
              {/* Image Placeholder */}
              <div className={`w-full md:w-2/5 min-h-[260px] ${route.color || "bg-brand-rust"} relative flex items-center justify-center shrink-0`}>
                {route.mainImage ? (
                  <Image src={urlFor(route.mainImage).url()} alt={route.name} fill className="object-cover" />
                ) : (
                  <p className="text-brand-white/20 font-heading text-xl uppercase tracking-widest">[ Route Photo ]</p>
                )}
                {/* Difficulty badge */}
                <span className="absolute top-4 left-4 bg-brand-white/20 backdrop-blur text-brand-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full font-sans z-10">
                  {route.difficulty}
                </span>
                {/* Number */}
                <span className="absolute bottom-4 right-4 font-heading text-8xl font-black text-brand-white/10 leading-none select-none z-10">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Content */}
              <div className="p-8 md:p-12 flex flex-col justify-center group-hover:bg-brand-dark transition-colors duration-300">
                <p className="text-brand-rust group-hover:text-brand-sand font-sans font-bold uppercase tracking-widest text-xs mb-3 transition-colors">{route.tagline}</p>
                <h2 className="font-heading text-4xl md:text-5xl font-black uppercase tracking-tighter text-brand-dark group-hover:text-brand-white mb-4 transition-colors leading-none">
                  {route.name}
                </h2>
                <p className="font-sans text-brand-dark/60 group-hover:text-brand-white/60 text-sm leading-relaxed mb-6 max-w-xl transition-colors line-clamp-3">
                  {route.description}
                </p>
                {/* Meta chips */}
                <div className="flex flex-wrap gap-3">
                  {[`${route.duration}`, `${route.distance}`, `Best: ${route.bestTime}`].map((chip) => (
                    <span key={chip} className="border border-brand-dark/20 group-hover:border-brand-white/30 text-brand-dark/60 group-hover:text-brand-white/60 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full font-sans transition-colors">
                      {chip}
                    </span>
                  ))}
                </div>
                <div className="mt-6 text-brand-rust group-hover:text-brand-sand font-sans text-xs font-bold uppercase tracking-widest transition-colors">
                  View Route →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
