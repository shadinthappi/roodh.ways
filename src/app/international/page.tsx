import React from "react";
import InternationalClient from "./InternationalClient";
import { sanityFetch } from "@/sanity/client";
import { groq } from "next-sanity";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "International Trips | roodh.ways",
  description: "Curated international destinations designed with passion and perfection."
};

export const revalidate = 60;

export default async function InternationalPage() {
  const query = groq`*[_type == "internationalTrip" && isPublished == true] | order(_createdAt desc) {
    title,
    "slug": slug.current,
    country,
    duration,
    style,
    priceFrom,
    themeColor,
    isFeatured,
    coverImage
  }`;
  
  const settingsQuery = groq`*[_type == "siteSettings"][0] { internationalHero }`;

  const [trips, settings] = await Promise.all([
    sanityFetch<any[]>(query),
    sanityFetch<any>(settingsQuery)
  ]);

  return <InternationalClient trips={trips} heroImage={settings?.internationalHero} />;
}
