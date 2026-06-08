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
  const query = groq`*[_type == "destination"] { "slug": slug.current }`;
  const slugs = await sanityFetch<{ slug: string }[]>(query);
  return slugs;
}

export const revalidate = 60;

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const destQuery = groq`*[_type == "destination" && slug.current == $slug][0] {
    name,
    "slug": slug.current,
    tagline,
    region,
    categories,
    description,
    bestTime,
    language,
    color,
    mainImage,
    generalItinerary,
    thingsToDo
  }`;
  const dest = await sanityFetch<any>(destQuery, { slug });
  
  if (!dest) notFound();

  const relatedQuery = groq`*[_type == "destination" && region == $region && slug.current != $slug][0...3] {
    name,
    "slug": slug.current,
    tagline,
    color,
    mainImage
  }`;
  const related = await sanityFetch<any[]>(relatedQuery, { region: dest.region, slug: dest.slug });

  return (
    <main className="min-h-screen bg-brand-white">
      <Header />

      {/* Full-screen Hero */}
      <section className="w-full h-screen min-h-[700px] relative flex flex-col justify-center pt-20 overflow-hidden">
        {dest.mainImage ? (
          <>
            <Image
              src={urlFor(dest.mainImage).url()}
              alt={dest.name}
              fill
              priority
              unoptimized
              className="object-cover absolute inset-0 z-0"
            />
            {/* Elegant gradient overlay to make text readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/70 to-transparent z-10" />
          </>
        ) : (
          <div className={`absolute inset-0 ${dest.color || "bg-brand-dark"} z-0`} />
        )}

        {/* Foreground Content */}
        <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col justify-center px-10 md:px-20 py-16 relative z-20">
          <p className="text-brand-blue font-sans font-bold uppercase tracking-widest text-sm mb-4">{dest.region}</p>
          <h1 className="font-heading font-black text-6xl md:text-8xl uppercase tracking-tighter text-brand-white leading-none mb-6">
            {dest.name}
          </h1>
          <p className="font-sans text-brand-sand text-xl mb-8">{dest.tagline}</p>
          <p className="font-sans text-brand-white/80 text-base leading-relaxed max-w-md mb-8">{dest.description}</p>
          <div className="flex flex-wrap gap-4 mb-8">
            {dest.categories?.map((cat: string) => (
              <span key={cat} className="border border-brand-white/30 text-brand-white/80 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full font-sans">
                {cat}
              </span>
            ))}
          </div>
          <div>
            <Link href="/plan" className="bg-brand-blue hover:bg-brand-blue/80 text-brand-white px-10 py-4 rounded-full font-heading uppercase tracking-wider font-bold transition-colors inline-block shadow-lg">
              Book a Trip
            </Link>
          </div>
        </div>
      </section>

      {/* At a Glance */}
      <section className="bg-brand-offwhite py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-3xl uppercase font-black tracking-tight text-brand-dark mb-8">At a Glance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Best Time to Visit", value: dest.bestTime },
              { label: "Local Language", value: dest.language },
              { label: "Currency", value: "Indian Rupee (₹)" },
              { label: "Time Zone", value: "IST (UTC +5:30)" },
            ].map((item) => (
              <div key={item.label} className="bg-brand-white p-6 rounded-2xl shadow-sm border border-brand-dark/5">
                <p className="font-sans text-xs font-bold uppercase tracking-widest text-brand-blue mb-2">{item.label}</p>
                <p className="font-heading text-lg font-bold text-brand-dark">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* General Itinerary */}
      {dest.generalItinerary && (
        <section className="bg-brand-white py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-4xl uppercase font-black tracking-tighter text-brand-dark mb-8">General Itinerary</h2>
            <div className="prose prose-lg prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-tighter prose-headings:font-black prose-p:font-sans prose-p:leading-relaxed prose-a:text-brand-blue max-w-none">
              <PortableText value={dest.generalItinerary} />
            </div>
          </div>
        </section>
      )}

      {/* Things To Do Carousel */}
      {dest.thingsToDo && dest.thingsToDo.length > 0 && (
        <section className="bg-brand-white py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-5xl uppercase font-black tracking-tighter text-brand-dark mb-10">Things To Do</h2>
            <div className="flex gap-6 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
              {dest.thingsToDo.map((thing: any, i: number) => (
                <div key={i} className={`relative overflow-hidden shrink-0 w-64 h-48 ${dest.color || "bg-brand-blue"} rounded-2xl flex items-end p-6 cursor-pointer group hover:opacity-90 transition-opacity`}>
                  {thing.image && (
                    <Image src={urlFor(thing.image).url()} alt={thing.title} fill unoptimized className="object-cover absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0" />
                  <h3 className="relative z-10 font-heading text-xl font-bold text-brand-white uppercase tracking-wide drop-shadow-md">{thing.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Getting There */}
      <section className="bg-brand-dark text-brand-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-5xl uppercase font-black tracking-tighter mb-10">Getting There</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: (
                <svg className="w-8 h-8 text-brand-sand" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5s-2.5 0-4 1.5L13.5 8.5 5.3 6.7 3.5 8.5l8.3 4.8-3.5 3.5-3.5-1L3 17.5 7 19.5l2 4 1.7-1.8-1-3.5 3.5-3.5 4.8 8.3 1.8-1.8z"></path>
                </svg>
              ), mode: "By Air", desc: "Major airports connect all Indian cities to domestic and international routes. Book in advance for the best fares." },
              { icon: (
                <svg className="w-8 h-8 text-brand-sand" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="4" y="3" width="16" height="15" rx="2"></rect>
                  <path d="M4 11h16M8 3v8M16 3v8M9 22v-4h6v4M6 18h12"></path>
                </svg>
              ), mode: "By Train", desc: "India's vast rail network is one of the world's largest. Trains offer scenic journeys and comfortable overnight options." },
              { icon: (
                <svg className="w-8 h-8 text-brand-sand" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="6" width="18" height="12" rx="2"></rect>
                  <path d="M7 22v-4h10v4M4 18h16M8 10h8"></path>
                </svg>
              ), mode: "By Road", desc: "Well-maintained highways connect most destinations. State buses, private coaches, and self-drive options are all available." },
            ].map((item) => (
              <div key={item.mode} className="bg-brand-white/5 border border-brand-white/10 p-8 rounded-2xl">
                <div className="mb-4">{item.icon}</div>
                <h3 className="font-heading text-2xl font-bold uppercase tracking-wide mb-3">{item.mode}</h3>
                <p className="font-sans text-brand-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Destinations */}
      {related.length > 0 && (
        <section className="bg-brand-offwhite py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-5xl uppercase font-black tracking-tighter text-brand-dark mb-10">Also in {dest.region}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((r) => (
                <Link key={r.slug} href={`/destinations/${r.slug}`} className={`${r.color || "bg-brand-blue"} rounded-2xl h-56 flex items-end p-8 group hover:opacity-90 transition-opacity relative overflow-hidden`}>
                  {r.mainImage && (
                    <>
                      <Image src={urlFor(r.mainImage).url()} alt={r.name} fill unoptimized className="object-cover absolute inset-0 z-0 transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0" />
                    </>
                  )}
                  <div className="relative z-10">
                    <p className="font-sans text-brand-white/60 text-xs font-bold uppercase tracking-widest mb-1">{r.tagline}</p>
                    <h3 className="font-heading text-3xl font-black uppercase tracking-tight text-brand-white">{r.name}</h3>
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
