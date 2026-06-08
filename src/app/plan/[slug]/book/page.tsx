import React from "react";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/sanity/client";
import { groq } from "next-sanity";
import { urlFor } from "@/sanity/image";
import Image from "next/image";
import BookingForm from "@/components/BookingForm";

export default async function BookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const query = groq`*[_type == "itinerary" && slug.current == $slug][0] {
    _id,
    title,
    priceFrom,
    themeColor,
    coverImage
  }`;
  const itinerary = await sanityFetch<any>(query, { slug });
  
  if (!itinerary) notFound();

  return (
    <main className="min-h-screen bg-brand-offwhite">
      <Header />

      <section className="pt-36 pb-24 px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
          
          {/* Left: Booking Form */}
          <div className="flex-1 bg-brand-white p-8 md:p-12 rounded-3xl shadow-sm border border-brand-dark/5">
            <h1 className="font-heading font-black text-4xl uppercase tracking-tighter text-brand-dark mb-2">
              Book Your Adventure
            </h1>
            <p className="font-sans text-brand-dark/60 mb-10">
              Fill out the details below to request a booking for {itinerary.title}. No payment is required right now.
            </p>
            
            <BookingForm 
              itineraryId={itinerary._id} 
              itineraryTitle={itinerary.title} 
              priceFrom={itinerary.priceFrom || 0} 
            />
          </div>

          {/* Right: Trip Summary */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-brand-white rounded-3xl shadow-sm border border-brand-dark/5 overflow-hidden sticky top-32">
              <div className={`w-full h-48 relative ${itinerary.themeColor || "bg-brand-blue"}`}>
                {itinerary.coverImage && (
                  <Image src={urlFor(itinerary.coverImage).url()} alt={itinerary.title} fill unoptimized className="object-cover mix-blend-overlay opacity-50" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="font-heading font-black text-2xl uppercase tracking-tighter text-brand-white leading-tight">
                    {itinerary.title}
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center py-4 border-b border-brand-dark/10">
                  <span className="font-sans text-sm font-bold text-brand-dark/60 uppercase tracking-widest">Starting Price</span>
                  <span className="font-heading font-bold text-xl text-brand-dark">₹{itinerary.priceFrom?.toLocaleString() || 0} <span className="text-sm font-sans font-normal text-brand-dark/60">/person</span></span>
                </div>
                <div className="pt-6">
                  <p className="text-xs text-brand-dark/60 leading-relaxed font-sans">
                    <strong>Note:</strong> This is a booking request. Our travel experts will review your details and contact you within 24 hours to confirm availability and finalize the itinerary.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
