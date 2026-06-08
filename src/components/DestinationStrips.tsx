import React from "react";
import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/sanity/client";
import { groq } from "next-sanity";
import { urlFor } from "@/sanity/image";

export default async function DestinationStrips() {
  const query = groq`*[_type == "destination" && isPublished == true] | order(isFeatured desc, _createdAt desc)[0...4] {
    name,
    "slug": slug.current,
    tagline,
    color,
    mainImage
  }`;
  const destinations = await sanityFetch<any[]>(query);

  return (
    <section className="w-full bg-brand-offwhite py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-brand-blue font-sans font-bold uppercase tracking-widest text-sm mb-4">Featured Places</p>
          <h2 className="font-heading text-5xl md:text-6xl font-black uppercase tracking-tighter text-brand-dark">
            Top Destinations
          </h2>
        </div>

        {/* Four vertical strip cards */}
        <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[600px]">
          {destinations.map((dest, i) => (
            <Link
              href={`/destinations/${dest.slug}`}
              key={i}
              className={`relative ${dest.color || "bg-brand-blue"} flex-1 rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:flex-[2] transition-all duration-500`}
            >
              {/* Image / Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                {dest.mainImage ? (
                  <Image src={urlFor(dest.mainImage).url()} alt={dest.name} fill unoptimized className="object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <p className="text-brand-white/20 font-heading text-lg uppercase tracking-widest writing-vertical text-center">[ Photo ]</p>
                )}
                {/* Overlay for text readability */}
                <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-brand-dark/40 transition-colors duration-500" />
              </div>

              {/* Map pin */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity z-10">
                <div className="w-5 h-5 rounded-full bg-brand-white border-2 border-brand-blue shadow" />
                <div className="w-0.5 h-8 bg-brand-white/50" />
              </div>

              {/* Bottom text */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-brand-dark/90 via-brand-dark/60 to-transparent flex flex-col items-center text-center z-10">
                <h3 className="font-heading text-2xl md:text-3xl font-black uppercase tracking-tight text-brand-white drop-shadow-md">
                  {dest.name}
                </h3>
                <p className="font-sans text-brand-sand text-sm uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow">
                  {dest.tagline}
                </p>
                <button className="mt-4 bg-brand-white text-brand-dark text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-brand-sand pointer-events-none">
                  Explore →
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
