import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/sanity/client";
import { groq } from "next-sanity";
import { urlFor } from "@/sanity/image";
import Image from "next/image";

export async function generateStaticParams() {
  const query = groq`*[_type == "story"] { "slug": slug.current }`;
  const slugs = await sanityFetch<{ slug: string }[]>(query);
  return slugs;
}

export const revalidate = 60;

export default async function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const storyQuery = groq`*[_type == "story" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    excerpt,
    category,
    readTime,
    color,
    mainImage
  }`;
  const story = await sanityFetch<any>(storyQuery, { slug });
  
  if (!story) notFound();

  const relatedQuery = groq`*[_type == "story" && slug.current != $slug && isPublished == true][0...3] {
    title,
    "slug": slug.current,
    category,
    color,
    mainImage
  }`;
  const related = await sanityFetch<any[]>(relatedQuery, { slug: story.slug });

  return (
    <main className="min-h-screen bg-brand-white">
      <Header />

      {/* Hero */}
      <section className={`w-full ${story.color || "bg-brand-blue"} pt-36 pb-24 px-6 relative`}>
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-brand-white/60 font-sans font-bold uppercase tracking-widest text-xs mb-6 block">{story.category} · {story.readTime}</span>
          <h1 className="font-heading font-black text-5xl md:text-7xl uppercase tracking-tighter text-brand-white leading-none mb-8">
            {story.title}
          </h1>
          <p className="font-sans text-brand-white/70 text-xl leading-relaxed">{story.excerpt}</p>
        </div>
      </section>

      {/* Article Body */}
      <section className="bg-brand-white py-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Featured image */}
          <div className={`w-full h-80 ${story.color || "bg-brand-blue"} rounded-2xl mb-12 flex items-center justify-center relative overflow-hidden`}>
            {story.mainImage ? (
              <Image src={urlFor(story.mainImage).url()} alt={story.title} fill unoptimized className="object-cover" />
            ) : (
              <p className="text-brand-white/20 font-heading text-xl uppercase tracking-widest">[ Featured Photo ]</p>
            )}
          </div>

          {/* Body content placeholder */}
          <div className="font-sans text-brand-dark/70 text-lg leading-[1.9] space-y-6">
            <p>
              India reveals itself slowly, in layers — the first impression is always overwhelming, but the real story begins when the chaos quiets and you start to notice the details. The smell of jasmine strung in doorways. The sound of temple bells carried on an evening breeze. The way a stranger offers you chai without any expectation.
            </p>
            <p>
              This is a story about that India — the one that does not appear in itineraries or travel brochures. The one you find when you slow down, take the wrong turn, and end up somewhere that does not have a name on any map.
            </p>
            <h2 className="font-heading text-3xl font-black uppercase tracking-tighter text-brand-dark mt-12 mb-4">Finding Your Way In</h2>
            <p>
              Every traveller arrives in India at a different speed. Some are ready to dive into the chaos from the first moment. Others need a few days to acclimatize — to let the noise and colour wash over them until it starts to make sense. Both are valid. India has room for every pace.
            </p>
            <p>
              The key is to let go of the plan. Not entirely — you still need a bed, a train ticket, perhaps a guide for the first few hours. But once the basics are sorted, India works best when you leave space for the unexpected.
            </p>
            <h2 className="font-heading text-3xl font-black uppercase tracking-tighter text-brand-dark mt-12 mb-4">What to Bring Home</h2>
            <p>
              The best souvenirs from India are not things. They are textures, colours, conversations, meals eaten on a railway platform, sunsets over rivers, and the particular quality of silence you find inside an ancient temple at dawn.
            </p>
            <p>
              Bring those home. They take up no space in your bag, and they last a lifetime.
            </p>
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-brand-dark/10 flex flex-wrap gap-3">
            {["India", story.category, "Travel Guide", "roodh.ways"].map((tag) => (
              <span key={tag} className="border border-brand-dark/20 text-brand-dark/50 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full font-sans">#{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Related Stories */}
      {related.length > 0 && (
        <section className="bg-brand-offwhite py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-5xl uppercase font-black tracking-tighter text-brand-dark mb-10">More Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((s) => (
                <Link key={s.slug} href={`/stories/${s.slug}`} className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-brand-white flex flex-col h-full">
                  <div className={`w-full h-44 ${s.color || "bg-brand-blue"} relative flex items-center justify-center shrink-0`}>
                    {s.mainImage ? (
                      <Image src={urlFor(s.mainImage).url()} alt={s.title} fill unoptimized className="object-cover" />
                    ) : (
                      <p className="text-brand-white/20 font-heading text-sm uppercase tracking-widest">[ Photo ]</p>
                    )}
                  </div>
                  <div className="p-6 group-hover:bg-brand-dark transition-colors duration-300 flex-grow flex flex-col">
                    <span className="text-brand-blue group-hover:text-brand-sand font-sans font-bold uppercase tracking-widest text-xs transition-colors">{s.category}</span>
                    <h3 className="font-heading text-lg font-black uppercase tracking-tight text-brand-dark group-hover:text-brand-white mt-2 leading-tight transition-colors">{s.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}


      <Footer />
    </main>
  );
}
