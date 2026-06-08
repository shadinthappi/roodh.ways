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
    "color": themeColor,
    description,
    highlights,
    mainImage,
    relatedDestinations[]-> {
      name,
      "slug": slug.current,
      tagline,
      "color": themeColor,
      mainImage
    }
  }`;
  const exp = await sanityFetch<any>(expQuery, { slug });
  
  if (!exp) notFound();

  // Use the linked related destinations. If none are linked, query a fallback of the first 4 published destinations.
  let relatedDests = exp.relatedDestinations || [];
  if (relatedDests.length === 0) {
    const relatedDestsQuery = groq`*[_type == "destination" && isPublished == true][0...4] {
      name,
      "slug": slug.current,
      tagline,
      "color": themeColor,
      mainImage
    }`;
    relatedDests = await sanityFetch<any[]>(relatedDestsQuery);
  }

  const otherExpsQuery = groq`*[_type == "experience" && slug.current != $slug && isPublished == true] {
    name,
    "slug": slug.current,
    "color": themeColor
  }`;
  const otherExps = await sanityFetch<any[]>(otherExpsQuery, { slug: exp.slug });

  const isHexColor = exp.color?.startsWith("#");
  const bgClass = isHexColor ? "" : (exp.color || "bg-brand-dark");
  const bgStyle = isHexColor ? { backgroundColor: exp.color } : {};

  return (
    <main className="min-h-screen bg-brand-white">
      <Header />

      {/* Full-screen Hero */}
      <section className="w-full h-screen min-h-[700px] relative flex flex-col justify-center pt-20 overflow-hidden">
        {exp.mainImage ? (
          <>
            <Image
              src={urlFor(exp.mainImage).url()}
              alt={exp.name}
              fill
              priority
              unoptimized
              className="object-cover absolute inset-0 z-0"
            />
            {/* Elegant gradient overlay to make text readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/70 to-transparent z-10" />
          </>
        ) : (
          <div className={`absolute inset-0 ${bgClass} z-0`} style={bgStyle} />
        )}

        {/* Foreground Content */}
        <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col justify-center px-10 md:px-20 py-16 relative z-20">
          <p className="text-brand-blue font-sans font-bold uppercase tracking-widest text-sm mb-4">{exp.tagline}</p>
          <h1 className="font-heading font-black text-6xl md:text-8xl uppercase tracking-tighter text-brand-white leading-none mb-6">
            {exp.name}
          </h1>
          <p className="font-sans text-brand-white/80 text-lg leading-relaxed max-w-md">{exp.description}</p>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-brand-dark py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-3xl uppercase font-black tracking-tight text-brand-white mb-8">Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {exp.highlights?.map((h: string, i: number) => (
              <div key={i} className="bg-brand-white/5 border border-brand-white/10 p-6 rounded-2xl">
                <div className="w-8 h-1 bg-brand-blue rounded mb-4" />
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
              {relatedDests.map((dest: any) => (
                <Link key={dest.slug} href={`/destinations/${dest.slug}`} className={`${dest.color || "bg-brand-blue"} rounded-2xl h-56 flex items-end p-6 group hover:opacity-90 transition-opacity relative overflow-hidden`}>
                  {dest.mainImage && (
                    <>
                      <Image src={urlFor(dest.mainImage).url()} alt={dest.name} fill unoptimized className="object-cover absolute inset-0 z-0 transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0" />
                    </>
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
              {otherExps.map((e: any) => {
                const isHex = e.color?.startsWith("#");
                const otherBgClass = isHex ? "" : (e.color || "bg-brand-dark");
                const otherBgStyle = isHex ? { backgroundColor: e.color } : {};
                return (
                  <Link
                    key={e.slug}
                    href={`/experiences/${e.slug}`}
                    className={`flex items-center gap-3 px-6 py-3 rounded-full text-brand-white font-heading font-bold uppercase tracking-wide text-sm hover:opacity-90 transition-opacity ${otherBgClass}`}
                    style={otherBgStyle}
                  >
                    {e.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <NewsletterSignup />
      <Footer />
    </main>
  );
}
