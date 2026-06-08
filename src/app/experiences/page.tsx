import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OpenChatButton from "@/components/OpenChatButton";
import PageHero from "@/components/PageHero";
import ExperienceTile from "@/components/ExperienceTile";
import { sanityFetch } from "@/sanity/client";
import { groq } from "next-sanity";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experiences | roodh.ways",
  description: "Find the experience that speaks to your soul, from ancient temples to alpine adventures."
};

export const revalidate = 60; // revalidate every minute

export default async function ExperiencesPage() {
  const query = groq`*[_type == "experience" && isPublished == true] | order(name asc) {
    name,
    "slug": slug.current,
    tagline,
    "color": themeColor,
    description,
    highlights,
    mainImage
  }`;
  
  const [experiences, settings] = await Promise.all([
    sanityFetch<any[]>(query),
    sanityFetch<any>(SITE_SETTINGS_QUERY)
  ]);

  return (
    <main className="min-h-screen bg-brand-white">
      <Header />
      <PageHero
        label="Travel Your Way"
        heading="Experiences"
        subheading="Every traveller is different. Find the experience that speaks to your soul."
        bgImage={settings?.experiencesHero || "/hero_experiences.png"}
      />

      {/* Intro */}
      <section className="bg-brand-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-sans text-brand-dark/70 text-lg md:text-xl leading-relaxed">
            Whether you seek ancient temples or alpine adventures, sun-drenched beaches or misty hill stations — India has an experience designed just for you. Choose your style and let us guide the way.
          </p>
        </div>
      </section>

      {/* Experience Tiles Grid */}
      <section className="bg-brand-offwhite py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <ExperienceTile key={exp.slug} {...exp} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-brand-dark py-24 px-6 text-center">
        <p className="text-brand-blue font-sans font-bold uppercase tracking-widest text-sm mb-6">Not Sure Where to Start?</p>
        <h2 className="font-heading text-5xl md:text-6xl font-black uppercase tracking-tighter text-brand-white mb-8">
          Let Us Build<br />Your Trip
        </h2>
        <OpenChatButton destination="Custom Experience" label="Plan A Trip →" className="inline-block bg-brand-blue hover:bg-brand-blue/80 text-brand-white px-10 py-4 rounded-full font-heading uppercase tracking-wider font-bold text-lg transition-colors" />
      </section>

      <Footer />
    </main>
  );
}
