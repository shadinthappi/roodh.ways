import React from "react";
import PlanClient from "./PlanClient";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/sanity/client";
import { groq } from "next-sanity";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trip Planner | roodh.ways",
  description: "Curated Indian itineraries and packages designed for every budget and style."
};

export const revalidate = 60;

export default async function PlanPage() {
  const query = groq`*[_type == "itinerary" && isPublished == true] | order(_createdAt desc) {
    title,
    "slug": slug.current,
    duration,
    style,
    budget,
    group,
    stops,
    description,
    priceFrom,
    themeColor,
    isFeatured,
    coverImage
  }`;
  
  const itineraries = await sanityFetch<any[]>(query);

  return <PlanClient itineraries={itineraries} footer={<Footer />} />;
}
