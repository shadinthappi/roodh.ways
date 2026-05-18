import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import { sanityFetch } from "@/sanity/client";
import { groq } from "next-sanity";
import { urlFor } from "@/sanity/image";
import Image from "next/image";

export async function generateStaticParams() {
  const query = groq`*[_type == "experience"] { "slug": slug.current }`;
  const slugs = await sanityFetch<{ slug: string }[]>(query);
  return slugs;
}

export const revalidate = 60;

export default async function ExperienceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const expQuery = groq`*[_type == "experience" && slug.current == $slug][0] {
    name,
    "slug": slug.current,
    tagline,
    icon,
    color,
    description,
    highlights
  }`;
  const exp = await sanityFetch<any>(expQuery, { slug });
  
  if (!exp) notFound();

  // Pick a few relevant destinations to show. For a real app this might be a reference field, but for now just fetch 4 random destinations or by some logic.
  const relatedDestsQuery = groq`*[_type == "destination" && isPublished == true][0...4] {
    name,
    "slug": slug.current,
    tagline,
    color,
    mainImage
  }`;
  const relatedDests = await sanityFetch<any[]>(relatedDestsQuery);

  const otherExpsQuery = groq`*[_type == "experience" && slug.current != $slug && isPublished == true] {
    name,
    "slug": slug.current,
    icon,
    color
  }`;
  const otherExps = await sanityFetch<any[]>(otherExpsQuery, { slug: exp.slug });

  return (
    <main className="min-h-screen bg-brand-white">
      <Header />

      {/* Hero */}
      <section className={`w-full ${exp.color || "bg-brand-rust"} pt-36 pb-24 px-6 relative`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-6xl mb-6">{exp.icon}</div>
          <p className="text-brand-white/60 font-sans font-bold uppercase tracking-widest text-sm mb-4">{exp.tagline}</p>
          <h1 className="font-heading font-black text-6xl md:text-8xl uppercase tracking-tighter text-brand-white leading-none mb-6">
            {exp.name}
          </h1>
          <p className="font-sans text-brand-white/70 text-lg leading-relaxed max-w-2xl">{exp.description}</p>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-brand-dark py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-3xl uppercase font-black tracking-tight text-brand-white mb-8">Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {exp.highlights?.map((h: string, i: number) => (
              <div key={i} className="bg-brand-white/5 border border-brand-white/10 p-6 rounded-2xl">
                <div className="w-8 h-1 bg-brand-rust rounded mb-4" />
                <p className="font-sans text-brand-white font-semibold text-sm leading-relaxed">{h}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Destinations */}
      {relatedDests.length > 0 && (
        <section className="bg-brand-offwhite py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-5xl uppercase font-black tracking-tighter text-brand-dark mb-10">
              Top Destinations for {exp.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedDests.map((dest) => (
                <Link key={dest.slug} href={`/destinations/${dest.slug}`} className={`${dest.color || "bg-brand-rust"} rounded-2xl h-56 flex items-end p-6 group hover:opacity-90 transition-opacity relative overflow-hidden`}>
                  {dest.mainImage && (
                    <Image src={urlFor(dest.mainImage).url()} alt={dest.name} fill className="object-cover absolute inset-0 z-0 opacity-50 group-hover:opacity-60 transition-opacity" />
                  )}
                  <div className="relative z-10">
                    <p className="font-sans text-brand-white/60 text-xs font-bold uppercase tracking-widest mb-1">{dest.tagline}</p>
                    <h3 className="font-heading text-2xl font-black uppercase tracking-tight text-brand-white">{dest.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other experiences */}
      {otherExps.length > 0 && (
        <section className="bg-brand-white py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-4xl uppercase font-black tracking-tighter text-brand-dark mb-8">More Experiences</h2>
            <div className="flex gap-4 flex-wrap">
              {otherExps.map((e) => (
                <Link key={e.slug} href={`/experiences/${e.slug}`} className={`${e.color || "bg-brand-rust"} flex items-center gap-3 px-6 py-3 rounded-full text-brand-white font-heading font-bold uppercase tracking-wide text-sm hover:opacity-90 transition-opacity`}>
                  <span>{e.icon}</span> {e.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <NewsletterSignup />
      <Footer />
    </main>
  );
}
