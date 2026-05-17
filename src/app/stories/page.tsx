import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { stories } from "@/data/stories";

export default function StoriesPage() {
  return (
    <main className="min-h-screen bg-brand-white">
      <Header />
      <PageHero
        label="Stories & Guides"
        heading="Explore Your Way"
        subheading="Travel writing, destination guides, and insider tips from across India."
      />

      {/* Featured Story */}
      <section className="bg-brand-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-brand-rust mb-6">Featured Story</p>
          <Link href={`/stories/${stories[0].slug}`} className={`group flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow bg-brand-offwhite`}>
            <div className={`w-full md:w-1/2 min-h-[340px] ${stories[0].color} flex items-center justify-center`}>
              <p className="text-brand-white/20 font-heading text-xl uppercase tracking-widest">[ Photo ]</p>
            </div>
            <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center group-hover:bg-brand-dark transition-colors duration-300">
              <span className="text-brand-rust group-hover:text-brand-sand font-sans font-bold uppercase tracking-widest text-xs mb-4 transition-colors">{stories[0].category} · {stories[0].readTime}</span>
              <h2 className="font-heading text-4xl md:text-5xl font-black uppercase tracking-tighter text-brand-dark group-hover:text-brand-white mb-4 leading-tight transition-colors">
                {stories[0].title}
              </h2>
              <p className="font-sans text-brand-dark/60 group-hover:text-brand-white/60 leading-relaxed transition-colors mb-6">{stories[0].excerpt}</p>
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-brand-rust group-hover:text-brand-sand transition-colors">Read Story →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* All Stories Grid */}
      <section className="bg-brand-offwhite py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-brand-rust mb-8">All Stories</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.slice(1).map((story) => (
              <Link key={story.slug} href={`/stories/${story.slug}`} className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-brand-white">
                <div className={`w-full h-52 ${story.color} flex items-center justify-center`}>
                  <p className="text-brand-white/20 font-heading text-base uppercase tracking-widest">[ Photo ]</p>
                </div>
                <div className="p-6 group-hover:bg-brand-dark transition-colors duration-300">
                  <span className="text-brand-rust group-hover:text-brand-sand font-sans font-bold uppercase tracking-widest text-xs transition-colors">{story.category} · {story.readTime}</span>
                  <h3 className="font-heading text-xl font-black uppercase tracking-tight text-brand-dark group-hover:text-brand-white mt-2 mb-3 leading-tight transition-colors">
                    {story.title}
                  </h3>
                  <p className="font-sans text-sm text-brand-dark/50 group-hover:text-brand-white/50 leading-relaxed transition-colors line-clamp-2">{story.excerpt}</p>
                  <div className="mt-4 text-brand-rust group-hover:text-brand-sand font-sans text-xs font-bold uppercase tracking-widest transition-colors">Read →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
