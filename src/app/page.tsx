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

export default function Home() {
  return (
    <main className="relative bg-brand-white w-full min-h-screen">
      <Header />
      <Hero />
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
