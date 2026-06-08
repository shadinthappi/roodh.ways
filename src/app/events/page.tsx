import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OpenChatButton from "@/components/OpenChatButton";
import PageHero from "@/components/PageHero";
import { sanityFetch } from "@/sanity/client";
import { groq } from "next-sanity";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export const revalidate = 60; // revalidate every minute

export default async function EventsPage() {
  const query = groq`*[_type == "event" && isPublished == true] | order(startDate asc) {
    name,
    "slug": slug.current,
    tagline,
    startDate,
    endDate,
    location,
    type,
    mainImage
  }`;
  
  const [events, settings] = await Promise.all([
    sanityFetch<any[]>(query),
    sanityFetch<any>(SITE_SETTINGS_QUERY)
  ]);

  return (
    <main className="min-h-screen bg-brand-white">
      <Header />
      <PageHero
        label="Festivals & Happenings"
        heading="Events"
        subheading="Immerse yourself in India's vibrant calendar of cultural, spiritual, and modern celebrations."
        bgImage={settings?.eventsHero || "/gateway-of-india.jpg"}
      />

      <section className="bg-brand-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-sans text-brand-dark/70 text-lg md:text-xl leading-relaxed">
            India's festival calendar is among the world's most vibrant. From Holi to Diwali, these events are not just celebrations — they are windows into the soul of an ancient civilization.
          </p>
        </div>
      </section>

      <section className="bg-brand-offwhite py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event) => (
            <div key={event.slug} className="bg-brand-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
              <div className={`${event.color || "bg-brand-blue"} p-10 flex items-end justify-between min-h-[200px]`}>
                <div className="text-6xl">{event.icon}</div>
                <div className="text-right">
                  <p className="text-brand-white/60 font-sans text-xs font-bold uppercase tracking-widest">{event.location}</p>
                  <p className="text-brand-white font-heading text-2xl font-bold uppercase tracking-wide">{event.month}</p>
                </div>
              </div>
              <div className="p-8 group-hover:bg-brand-dark transition-colors duration-300 h-full">
                <p className="text-brand-blue group-hover:text-brand-sand font-sans font-bold uppercase tracking-widest text-xs mb-3 transition-colors">{event.tagline}</p>
                <h2 className="font-heading text-3xl font-black uppercase tracking-tight text-brand-dark group-hover:text-brand-white mb-4 transition-colors">{event.name}</h2>
                <p className="font-sans text-brand-dark/60 group-hover:text-brand-white/60 text-sm leading-relaxed transition-colors">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-dark py-24 px-6 text-center">
        <p className="text-brand-blue font-sans font-bold uppercase tracking-widest text-sm mb-6">Plan Around a Festival</p>
        <h2 className="font-heading text-5xl font-black uppercase tracking-tighter text-brand-white mb-8">Time Your<br />Perfect Trip</h2>
        <OpenChatButton destination="Corporate Events" label="Plan A Trip →" className="inline-block bg-brand-blue hover:bg-brand-blue/80 text-brand-white px-10 py-4 rounded-full font-heading uppercase tracking-wider font-bold text-lg transition-colors" />
      </section>

      <Footer />
    </main>
  );
}
