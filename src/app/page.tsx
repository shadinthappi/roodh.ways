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
import NewsletterSignup from "@/components/NewsletterSignup";
import Footer from "@/components/Footer";

export default async function Home() {
  const featuredQuery = groq`*[_type == "destination" && isFeatured == true] | order(_createdAt desc) {
    name,
    "slug": slug.current,
    tagline,
    region,
    categories,
    mainImage
  }`;
  
  const featuredDestinations = await sanityFetch<any[]>(featuredQuery);

  return (
    <main className="relative bg-brand-white w-full min-h-screen">
      <Header />
      <Hero featuredDestinations={featuredDestinations} />
      <IntroBlock />
      <RegionMap />
      <ScrollShowcase />
      <ArticleCarousel />
      <VisaFaq />
      <DestinationStrips />
      <SocialFeed />
      <NewsletterSignup />
      <Footer />
    </main>
  );
}
