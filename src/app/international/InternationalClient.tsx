import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ItineraryCard from "@/components/ItineraryCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { urlFor } from "@/sanity/image";
import Image from "next/image";

export default function InternationalClient({ trips, heroImage }: { trips: any[], heroImage?: any }) {
  return (
    <main className="min-h-screen bg-brand-white">
      <Header />

      {/* Hero */}
      <section className="w-full bg-brand-dark pt-36 pb-24 px-6 relative overflow-hidden min-h-[60vh] flex items-center">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #3498db 0%, transparent 60%)" }} />
        {heroImage && (
          <>
            <Image src={urlFor(heroImage).url()} alt="International Hero" fill unoptimized className="object-cover absolute inset-0 z-0 transition-opacity duration-1000" />
            <div className="absolute inset-0 bg-brand-dark/40 z-0" />
          </>
        )}
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-1">
            <p className="text-brand-blue font-sans font-bold uppercase tracking-widest text-sm mb-6">Explore the World</p>
            <h1 className="font-heading font-black text-6xl md:text-8xl uppercase tracking-tighter text-brand-white leading-none mb-8">
              International<br />Trips
            </h1>
            <p className="font-sans text-brand-white/60 text-lg leading-relaxed max-w-xl mb-8">
              Take your journey beyond borders. Discover our specially curated international destinations designed with the same passion and perfection you expect.
            </p>
          </div>
        </div>
      </section>

      {/* Trip Cards */}
      <section className="bg-brand-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-4xl uppercase font-black tracking-tighter text-brand-dark mb-12">All International Destinations</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trips.map((trip) => (
              <ItineraryCard 
                key={trip.slug} 
                {...trip} 
                stops={[trip.country]}
                budget={trip.currency || "Various"}
                group={trip.visaRequirement || "Check Visa Requirements"}
                basePath="/international"
              />
            ))}
          </div>
          
          {trips.length === 0 && (
             <div className="text-center py-12">
               <p className="font-sans text-brand-dark/50 text-lg">No international trips published yet. Check back soon!</p>
             </div>
          )}
        </div>
      </section>

      <NewsletterSignup />
      <Footer />
    </main>
  );
}
