import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { destinations } from "@/data/destinations";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dest = destinations.find((d) => d.slug === slug);
  if (!dest) notFound();

  const related = destinations.filter((d) => d.slug !== dest.slug && d.region === dest.region).slice(0, 3);

  const things = [
    "Explore Local Markets", "Visit Iconic Landmarks", "Try Regional Cuisine",
    "Guided Heritage Walk", "Sunset Viewpoint", "Local Cultural Show",
  ];

  return (
    <main className="min-h-screen bg-brand-white">
      <Header />

      {/* Split-screen Hero */}
      <section className="w-full flex flex-col md:flex-row h-auto md:h-screen pt-[66px]">
        {/* Left: Text */}
        <div className="w-full md:w-1/2 bg-brand-dark flex flex-col justify-center px-10 md:px-20 py-20">
          <p className="text-brand-rust font-sans font-bold uppercase tracking-widest text-sm mb-4">{dest.region}</p>
          <h1 className="font-heading font-black text-6xl md:text-8xl uppercase tracking-tighter text-brand-white leading-none mb-6">
            {dest.name}
          </h1>
          <p className="font-sans text-brand-sand text-xl mb-10">{dest.tagline}</p>
          <p className="font-sans text-brand-white/70 text-base leading-relaxed max-w-md mb-10">{dest.description}</p>
          <div className="flex flex-wrap gap-4">
            {dest.categories.map((cat) => (
              <span key={cat} className="border border-brand-white/30 text-brand-white/70 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full font-sans">
                {cat}
              </span>
            ))}
          </div>
        </div>
        {/* Right: Image Placeholder */}
        <div className={`w-full md:w-1/2 ${dest.color} relative min-h-[400px] flex items-center justify-center`}>
          <p className="text-brand-white/20 font-heading text-3xl uppercase tracking-widest">[ Photo ]</p>
        </div>
      </section>

      {/* At a Glance */}
      <section className="bg-brand-offwhite py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-3xl uppercase font-black tracking-tight text-brand-dark mb-8">At a Glance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Best Time to Visit", value: dest.bestTime },
              { label: "Local Language", value: dest.language },
              { label: "Currency", value: "Indian Rupee (₹)" },
              { label: "Time Zone", value: "IST (UTC +5:30)" },
            ].map((item) => (
              <div key={item.label} className="bg-brand-white p-6 rounded-2xl shadow-sm border border-brand-dark/5">
                <p className="font-sans text-xs font-bold uppercase tracking-widest text-brand-rust mb-2">{item.label}</p>
                <p className="font-heading text-lg font-bold text-brand-dark">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Things To Do Carousel */}
      <section className="bg-brand-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-5xl uppercase font-black tracking-tighter text-brand-dark mb-10">Things To Do</h2>
          <div className="flex gap-6 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
            {things.map((thing, i) => (
              <div key={i} className={`shrink-0 w-64 h-48 ${dest.color} rounded-2xl flex items-end p-6 cursor-pointer group hover:opacity-90 transition-opacity`}>
                <h3 className="font-heading text-xl font-bold text-brand-white uppercase tracking-wide">{thing}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting There */}
      <section className="bg-brand-dark text-brand-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-5xl uppercase font-black tracking-tighter mb-10">Getting There</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "✈️", mode: "By Air", desc: "Major airports connect all Indian cities to domestic and international routes. Book in advance for the best fares." },
              { icon: "🚂", mode: "By Train", desc: "India's vast rail network is one of the world's largest. Trains offer scenic journeys and comfortable overnight options." },
              { icon: "🚌", mode: "By Road", desc: "Well-maintained highways connect most destinations. State buses, private coaches, and self-drive options are all available." },
            ].map((item) => (
              <div key={item.mode} className="bg-brand-white/5 border border-brand-white/10 p-8 rounded-2xl">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-heading text-2xl font-bold uppercase tracking-wide mb-3">{item.mode}</h3>
                <p className="font-sans text-brand-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Destinations */}
      {related.length > 0 && (
        <section className="bg-brand-offwhite py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-5xl uppercase font-black tracking-tighter text-brand-dark mb-10">Also in {dest.region}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((r) => (
                <Link key={r.slug} href={`/destinations/${r.slug}`} className={`${r.color} rounded-2xl h-56 flex items-end p-8 group hover:opacity-90 transition-opacity`}>
                  <div>
                    <p className="font-sans text-brand-white/60 text-xs font-bold uppercase tracking-widest mb-1">{r.tagline}</p>
                    <h3 className="font-heading text-3xl font-black uppercase tracking-tight text-brand-white">{r.name}</h3>
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
