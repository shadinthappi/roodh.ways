import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/sanity/client";
import { groq } from "next-sanity";
import { urlFor } from "@/sanity/image";
import Image from "next/image";

export async function generateStaticParams() {
  const query = groq`*[_type == "route"] { "slug": slug.current }`;
  const slugs = await sanityFetch<{ slug: string }[]>(query);
  return slugs;
}

export const revalidate = 60;

export default async function RouteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const routeQuery = groq`*[_type == "route" && slug.current == $slug][0] {
    name,
    "slug": slug.current,
    tagline,
    difficulty,
    color,
    description,
    duration,
    distance,
    bestTime,
    stops,
    highlights,
    mainImage
  }`;
  const route = await sanityFetch<any>(routeQuery, { slug });
  
  if (!route) notFound();

  const relatedQuery = groq`*[_type == "route" && slug.current != $slug && isPublished == true][0...2] {
    name,
    "slug": slug.current,
    tagline,
    duration,
    color,
    mainImage
  }`;
  const related = await sanityFetch<any[]>(relatedQuery, { slug: route.slug });

  return (
    <main className="min-h-screen bg-brand-white">
      <Header />

      {/* Hero */}
      <section className={`w-full ${route.color || "bg-brand-blue"} pt-36 pb-24 px-6 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "40px 40px" }} />
        {route.mainImage && (
          <>
            <Image src={urlFor(route.mainImage).url()} alt={route.name} fill unoptimized className="object-cover absolute inset-0 z-0" />
            <div className="absolute inset-0 bg-brand-dark/40 z-0" />
          </>
        )}
        <div className="max-w-7xl mx-auto relative z-10">
          <p className="text-brand-white/60 font-sans font-bold uppercase tracking-widest text-sm mb-4">{route.tagline}</p>
          <h1 className="font-heading font-black text-6xl md:text-8xl uppercase tracking-tighter text-brand-white leading-none mb-6">
            {route.name}
          </h1>
          <p className="font-sans text-brand-white/70 text-lg leading-relaxed max-w-2xl mb-10">{route.description}</p>
          {/* Meta */}
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Duration", val: route.duration },
              { label: "Distance", val: route.distance },
              { label: "Difficulty", val: route.difficulty },
              { label: "Best Time", val: route.bestTime },
            ].map((m) => (
              <div key={m.label} className="bg-brand-white/10 border border-brand-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
                <p className="font-sans text-brand-white/50 text-xs uppercase tracking-widest">{m.label}</p>
                <p className="font-heading text-brand-white font-bold text-lg uppercase">{m.val}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Route Stops */}
      <section className="bg-brand-dark py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-5xl uppercase font-black tracking-tighter text-brand-white mb-12">The Route</h2>
          <div className="flex flex-col md:flex-row gap-0 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-6 left-6 right-6 h-0.5 bg-brand-blue/30" />
            {route.stops?.map((stop: string, i: number) => (
              <div key={i} className="flex md:flex-col items-center md:items-start gap-6 md:gap-4 flex-1 relative pb-8 md:pb-0">
                {/* Circle */}
                <div className="shrink-0 w-12 h-12 rounded-full bg-brand-blue border-4 border-brand-dark flex items-center justify-center font-heading font-black text-brand-white text-sm z-10">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold uppercase tracking-wide text-brand-white">{stop}</h3>
                  <div className={`mt-3 w-full md:w-auto h-28 md:h-36 ${route.color || "bg-brand-blue"} rounded-xl flex items-center justify-center`}>
                    <p className="text-brand-white/20 font-heading text-xs uppercase tracking-widest">[ Photo ]</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-brand-offwhite py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-5xl uppercase font-black tracking-tighter text-brand-dark mb-10">Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {route.highlights?.map((h: string, i: number) => (
              <div key={i} className="bg-brand-white p-6 rounded-2xl shadow-sm border border-brand-dark/5 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center shrink-0">
                  <span className="text-brand-white font-bold font-sans text-xs">{i + 1}</span>
                </div>
                <p className="font-sans font-semibold text-brand-dark">{h}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Routes */}
      {related.length > 0 && (
        <section className="bg-brand-white py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-5xl uppercase font-black tracking-tighter text-brand-dark mb-10">More Routes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {related.map((r) => (
                <Link key={r.slug} href={`/routes/${r.slug}`} className={`${r.color || "bg-brand-blue"} rounded-2xl p-10 flex flex-col justify-end min-h-[240px] group hover:opacity-90 transition-opacity relative overflow-hidden`}>
                  {r.mainImage && (
                    <>
                      <Image src={urlFor(r.mainImage).url()} alt={r.name} fill unoptimized className="object-cover absolute inset-0 z-0 transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0" />
                    </>
                  )}
                  <div className="relative z-10">
                    <p className="font-sans text-brand-white/60 text-xs font-bold uppercase tracking-widest mb-2">{r.tagline} · {r.duration}</p>
                    <h3 className="font-heading text-4xl font-black uppercase tracking-tighter text-brand-white">{r.name}</h3>
                    <p className="mt-3 text-brand-white font-sans text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View Route →</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}


      <Footer />
    </main>
  );
}
