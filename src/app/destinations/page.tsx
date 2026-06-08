import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import DestinationsClient from "./DestinationsClient";
import { sanityFetch } from "@/sanity/client";
import { groq } from "next-sanity";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export const revalidate = 60; // revalidate every minute

export default async function DestinationsPage() {
  const query = groq`*[_type == "destination" && isPublished == true] | order(name asc) {
    name,
    "slug": slug.current,
    tagline,
    region,
    categories,
    description,
    bestTime,
    language,
    color,
    mainImage
  }`;
  
  const [destinations, settings] = await Promise.all([
    sanityFetch<any[]>(query),
    sanityFetch<any>(SITE_SETTINGS_QUERY)
  ]);

  return (
    <main className="min-h-screen bg-brand-white">
      <Header />
      <PageHero
        label="Explore India"
        heading="Destinations"
        subheading="From the heights of the Himalayas to the shores of the Indian Ocean — find your perfect place."
        bgImage={settings?.destinationsHero || "/hero_destinations.png"}
      />

      <DestinationsClient destinations={destinations} />

      <Footer />
    </main>
  );
}
