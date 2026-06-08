import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/sanity/client";
import { groq, PortableText } from "next-sanity";
import { urlFor } from "@/sanity/image";
import Image from "next/image";

export async function generateStaticParams() {
  const query = groq`*[_type == "itinerary"] { "slug": slug.current }`;
  const slugs = await sanityFetch<{ slug: string }[]>(query);
  return slugs;
}

export const revalidate = 60;

export default async function ItineraryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const query = groq`*[_type == "itinerary" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    duration,
    style,
    budget,
    group,
    stops,
    description,
    priceFrom,
    themeColor,
    dayByDayPlan,
    coverImage
  }`;
  const itinerary = await sanityFetch<any>(query, { slug });
  
  if (!itinerary) notFound();

  return (
    <main className="min-h-screen bg-brand-white">
      <Header />

      {/* Hero */}
      <section className={`w-full ${itinerary.themeColor || "bg-brand-blue"} pt-36 pb-24 px-6 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "40px 40px" }} />
        {itinerary.coverImage && (
          <>
            <Image src={urlFor(itinerary.coverImage).url()} alt={itinerary.title} fill unoptimized className="object-cover absolute inset-0 z-0" />
            <div className="absolute inset-0 bg-brand-dark/40 z-0" />
          </>
        )}
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-wrap gap-4 mb-6">
            <span className="bg-brand-white/20 backdrop-blur-md text-brand-white font-sans font-bold uppercase tracking-widest text-xs px-4 py-2 rounded-full">{itinerary.style}</span>
            <span className="bg-brand-white/20 backdrop-blur-md text-brand-white font-sans font-bold uppercase tracking-widest text-xs px-4 py-2 rounded-full">{itinerary.budget}</span>
            <span className="bg-brand-white/20 backdrop-blur-md text-brand-white font-sans font-bold uppercase tracking-widest text-xs px-4 py-2 rounded-full">{itinerary.duration}</span>
          </div>
          <h1 className="font-heading font-black text-5xl md:text-7xl uppercase tracking-tighter text-brand-white leading-none mb-8">
            {itinerary.title}
          </h1>
          <p className="font-sans text-brand-white/80 text-xl leading-relaxed mb-8 max-w-2xl">{itinerary.description}</p>
          
          <div className="flex items-center gap-6">
             <div className="bg-brand-dark/30 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center">
                 <p className="font-sans text-brand-white/60 text-xs font-bold uppercase tracking-widest mb-1">Starting from</p>
                 <p className="font-heading font-black text-4xl text-brand-white">₹{itinerary.priceFrom?.toLocaleString()}</p>
             </div>
             <Link href={`/plan/${itinerary.slug}/book`} className="bg-brand-white text-brand-dark hover:bg-brand-sand hover:text-brand-dark px-8 py-6 rounded-2xl font-heading uppercase tracking-wider font-bold transition-colors">
                 Book This Trip
             </Link>
          </div>
        </div>
      </section>

      {/* Overview & Stops */}
      <section className="bg-brand-offwhite py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-4xl uppercase font-black tracking-tighter text-brand-dark mb-8">The Route</h2>
          <div className="flex flex-wrap gap-4 mb-16">
            {itinerary.stops?.map((stop: string, i: number) => (
              <div key={i} className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-full ${itinerary.themeColor || "bg-brand-blue"} text-brand-white flex items-center justify-center font-bold text-sm`}>{i + 1}</span>
                <span className="font-heading text-2xl uppercase font-bold text-brand-dark">{stop}</span>
                {i < itinerary.stops.length - 1 && (
                  <span className="text-brand-dark/20 text-2xl">→</span>
                )}
              </div>
            ))}
          </div>

          <h2 className="font-heading text-4xl uppercase font-black tracking-tighter text-brand-dark mb-8">Day-by-Day Plan</h2>
          <div className="prose prose-lg prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-tighter prose-headings:font-black prose-p:font-sans prose-p:leading-relaxed prose-a:text-brand-blue max-w-none">
            {itinerary.dayByDayPlan ? (
              <PortableText value={itinerary.dayByDayPlan} />
            ) : (
              <p className="text-brand-dark/50 italic">Detailed itinerary coming soon.</p>
            )}
          </div>
        </div>
      </section>


      <Footer />
    </main>
  );
}
