import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import { sanityFetch } from "@/sanity/client";
import { groq, PortableText } from "next-sanity";
import { urlFor } from "@/sanity/image";
import Image from "next/image";

export async function generateStaticParams() {
  const query = groq`*[_type == "internationalTrip"] { "slug": slug.current }`;
  const slugs = await sanityFetch<{ slug: string }[]>(query);
  return slugs;
}

export const revalidate = 60;

export default async function InternationalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const query = groq`*[_type == "internationalTrip" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    country,
    duration,
    visaRequirement,
    currency,
    style,
    description,
    priceFrom,
    themeColor,
    dayByDayPlan,
    coverImage
  }`;
  const trip = await sanityFetch<any>(query, { slug });
  
  if (!trip) notFound();

  return (
    <main className="min-h-screen bg-brand-white">
      <Header />

      {/* Hero */}
      <section className={`w-full bg-[${trip.themeColor || "#3498db"}] pt-36 pb-24 px-6 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "40px 40px" }} />
        {trip.coverImage && (
          <>
            <Image src={urlFor(trip.coverImage).url()} alt={trip.title} fill unoptimized className="object-cover absolute inset-0 z-0" />
            <div className="absolute inset-0 bg-brand-dark/40 z-0" />
          </>
        )}
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-wrap gap-4 mb-6">
            <span className="bg-brand-white/20 backdrop-blur-md text-brand-white font-sans font-bold uppercase tracking-widest text-xs px-4 py-2 rounded-full">{trip.style}</span>
            <span className="bg-brand-white/20 backdrop-blur-md text-brand-white font-sans font-bold uppercase tracking-widest text-xs px-4 py-2 rounded-full">{trip.duration}</span>
            <span className="bg-brand-white/20 backdrop-blur-md text-brand-white font-sans font-bold uppercase tracking-widest text-xs px-4 py-2 rounded-full">{trip.country}</span>
          </div>
          <h1 className="font-heading font-black text-5xl md:text-7xl uppercase tracking-tighter text-brand-white leading-none mb-8 drop-shadow-md">
            {trip.title}
          </h1>
          <p className="font-sans text-brand-white text-xl leading-relaxed mb-8 max-w-2xl drop-shadow">{trip.description}</p>
          
          <div className="flex items-center gap-6">
             <div className="bg-brand-dark/30 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center shadow-lg">
                 <p className="font-sans text-brand-white/80 text-xs font-bold uppercase tracking-widest mb-1">Starting from</p>
                 <p className="font-heading font-black text-4xl text-brand-white">₹{trip.priceFrom?.toLocaleString()}</p>
             </div>
             <button className="bg-brand-white text-brand-dark hover:bg-brand-sand hover:text-brand-dark px-8 py-6 rounded-2xl font-heading uppercase tracking-wider font-bold transition-colors shadow-lg cursor-not-allowed opacity-80">
                 Book This Trip (Soon)
             </button>
          </div>
        </div>
      </section>

      {/* Overview & Stops */}
      <section className="bg-brand-offwhite py-20 px-6">
        <div className="max-w-4xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 bg-brand-white p-8 rounded-2xl shadow-sm border border-brand-dark/5">
            <div>
              <p className="font-sans text-brand-dark/50 text-xs font-bold uppercase tracking-widest mb-1">Visa</p>
              <p className="font-heading font-bold text-xl text-brand-dark">{trip.visaRequirement || "Check Entry Rules"}</p>
            </div>
            <div>
              <p className="font-sans text-brand-dark/50 text-xs font-bold uppercase tracking-widest mb-1">Currency</p>
              <p className="font-heading font-bold text-xl text-brand-dark">{trip.currency || "Local Currency"}</p>
            </div>
          </div>

          <h2 className="font-heading text-4xl uppercase font-black tracking-tighter text-brand-dark mb-8">Day-by-Day Plan</h2>
          <div className="prose prose-lg prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-tighter prose-headings:font-black prose-p:font-sans prose-p:leading-relaxed prose-a:text-brand-blue max-w-none">
            {trip.dayByDayPlan ? (
              <PortableText value={trip.dayByDayPlan} />
            ) : (
              <p className="text-brand-dark/50 italic">Detailed itinerary coming soon.</p>
            )}
          </div>
        </div>
      </section>

      <NewsletterSignup />
      <Footer />
    </main>
  );
}
