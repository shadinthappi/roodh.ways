import { groq } from "next-sanity";
import { sanityFetch } from "@/sanity/client";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import IntroBlock from "@/components/IntroBlock";
import RegionMap from "@/components/RegionMap";
import ScrollShowcase from "@/components/ScrollShowcase";
import ArticleCarousel from "@/components/ArticleCarousel";
import VisaFaq from "@/components/VisaFaq";
import DestinationStrips from "@/components/DestinationStrips";
import SocialFeed from "@/components/SocialFeed";
import Footer from "@/components/Footer";
import TestimonialsSection from "@/components/TestimonialsSection";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export default async function Home() {
  const featuredQuery = groq`*[_type == "destination" && isFeatured == true] | order(_createdAt desc) {
    name,
    "slug": slug.current,
    tagline,
    region,
    categories,
    mainImage
  }`;
  
  const storiesQuery = groq`*[_type == "story" && isPublished == true] | order(publishedAt desc)[0...6] {
    title, "slug": slug.current, category, excerpt, coverImage, themeColor, readTime
  }`;

  const [featuredDestinations, settings, stories] = await Promise.all([
    sanityFetch<any[]>(featuredQuery).catch(() => []),
    sanityFetch<any>(SITE_SETTINGS_QUERY).catch(() => null),
    sanityFetch<any[]>(storiesQuery).catch(() => [])
  ]);

  return (
    <main className="relative bg-brand-white w-full min-h-screen">
      <Header />
      <Hero featuredDestinations={featuredDestinations} />
      <IntroBlock />
      <RegionMap />
      <ScrollShowcase />
      <DestinationStrips />
      <TestimonialsSection />
      <VisaFaq />
      <SocialFeed 
        instagramUrl={settings?.instagramUrl} 
        feedImages={settings?.socialFeedImages}
      />
      <ArticleCarousel stories={stories} />

      <Footer />
    </main>
  );
}
