import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { sanityFetch } from "@/sanity/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

const benefits = [
  { icon: (
    <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M16 3h5v5M8 3H3v5M12 22V12m0 0l-4 4m4-4l4 4M21 3l-9 9-9-9"></path>
    </svg>
  ), title: "Co-op Marketing", desc: "Access our library of premium India travel assets, campaign toolkits, and brand resources to grow your business." },
  { icon: (
    <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  ), title: "Market Intelligence", desc: "Get access to exclusive travel trend reports, visitor statistics, and market insights to power your strategy." },
  { icon: (
    <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M22 10v6M2 10l10-5 10 5-10 5-10 5v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
    </svg>
  ), title: "Training & Education", desc: "Enrol your agents in our India Specialist Program — a free online certification covering destinations, culture, and logistics." },
  { icon: (
    <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2c-.2 2.2-.4 4.8-.4 8 0 3.2.2 5.8.4 8M12 2c.2 2.2.4 4.8.4 8 0 3.2-.2 5.8-.4 8M2 12h20"></path>
    </svg>
  ), title: "Global Network", desc: "Connect with a network of Indian tourism boards, hotels, tour operators, and ground handlers across all regions." },
];

const partnerTypes = [
  { type: "Tour Operators", desc: "Design and sell India itineraries with confidence using our destination resources and specialist support.", icon: (
    <svg className="w-8 h-8 text-brand-sand" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6zM9 3v15M15 6v15"></path>
    </svg>
  ) },
  { type: "Travel Agents", desc: "Get certified as an India Specialist and access exclusive deals, FAM trip opportunities, and client resources.", icon: (
    <svg className="w-8 h-8 text-brand-sand" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  ) },
  { type: "Media & Influencers", desc: "Partner with roodh.ways for press trips, content collaborations, and media hosting across India.", icon: (
    <svg className="w-8 h-8 text-brand-sand" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>
  ) },
  { type: "Airlines & Hotels", desc: "Collaborate on joint marketing campaigns to drive inbound travel demand and grow your India footprint.", icon: (
    <svg className="w-8 h-8 text-brand-sand" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5s-2.5 0-4 1.5L13.5 8.5 5.3 6.7 3.5 8.5l8.3 4.8-3.5 3.5-3.5-1L3 17.5 7 19.5l2 4 1.7-1.8-1-3.5 3.5-3.5 4.8 8.3 1.8-1.8z"></path>
    </svg>
  ) },
];

export const revalidate = 60;

export default async function TravelTradePage() {
  const settings = await sanityFetch<any>(SITE_SETTINGS_QUERY);

  return (
    <main className="min-h-screen bg-brand-white">
      <Header />
      <PageHero
        label="B2B Partnerships"
        heading="Travel Trade"
        subheading="Partner with Roodh.ways for premium, hand-crafted Indian experiences for your clients."
        bgImage={settings?.travelTradeHero || "/hero_bg.png"}
      />

      {/* Intro */}
      <section className="bg-brand-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-sans text-brand-dark/70 text-lg md:text-xl leading-relaxed">
            roodh.ways works with travel trade professionals worldwide to promote India as a premier destination. Whether you are a tour operator, travel agent, airline, or media partner — we have tools and resources designed to help you succeed.
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="bg-brand-offwhite py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-5xl font-black uppercase tracking-tighter text-brand-dark mb-12">Why Partner With Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-brand-white p-8 rounded-2xl shadow-sm border border-brand-dark/5 hover:border-brand-blue transition-colors group">
                <div className="mb-4">{b.icon}</div>
                <h3 className="font-heading text-xl font-bold uppercase tracking-tight text-brand-dark mb-3 group-hover:text-brand-blue transition-colors">{b.title}</h3>
                <p className="font-sans text-brand-dark/60 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="bg-brand-dark py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-5xl font-black uppercase tracking-tighter text-brand-white mb-12">Who We Work With</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnerTypes.map((p) => (
              <div key={p.type} className="bg-brand-white/5 border border-brand-white/10 p-8 rounded-2xl hover:border-brand-sand transition-colors group">
                <div className="mb-4">{p.icon}</div>
                <h3 className="font-heading text-2xl font-bold uppercase tracking-tight text-brand-white mb-3 group-hover:text-brand-sand transition-colors">{p.type}</h3>
                <p className="font-sans text-brand-white/60 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Register CTA */}
      <section className="bg-brand-sand py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-brand-blue font-sans font-bold uppercase tracking-widest text-sm mb-6">Get Started</p>
          <h2 className="font-heading text-5xl font-black uppercase tracking-tighter text-brand-dark mb-8">
            Register as<br />a Trade Partner
          </h2>
          <p className="font-sans text-brand-dark/70 text-lg mb-10">
            Fill in the form below and our trade team will be in touch within 2 business days.
          </p>
          <form className="flex flex-col gap-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" className="bg-transparent border-b-2 border-brand-dark/30 focus:border-brand-dark py-3 font-sans text-brand-dark placeholder-brand-dark/40 focus:outline-none transition-colors" />
              <input type="text" placeholder="Company Name" className="bg-transparent border-b-2 border-brand-dark/30 focus:border-brand-dark py-3 font-sans text-brand-dark placeholder-brand-dark/40 focus:outline-none transition-colors" />
              <input type="email" placeholder="Business Email" className="bg-transparent border-b-2 border-brand-dark/30 focus:border-brand-dark py-3 font-sans text-brand-dark placeholder-brand-dark/40 focus:outline-none transition-colors" />
              <input type="text" placeholder="Country" className="bg-transparent border-b-2 border-brand-dark/30 focus:border-brand-dark py-3 font-sans text-brand-dark placeholder-brand-dark/40 focus:outline-none transition-colors" />
            </div>
            <select className="bg-transparent border-b-2 border-brand-dark/30 focus:border-brand-dark py-3 font-sans text-brand-dark/70 focus:outline-none transition-colors mt-2">
              <option value="">Partner Type</option>
              {partnerTypes.map((p) => <option key={p.type} value={p.type}>{p.type}</option>)}
            </select>
            <button type="submit" className="mt-6 self-start bg-brand-dark hover:bg-brand-blue text-brand-white px-10 py-4 rounded-full font-heading uppercase tracking-wider font-bold transition-colors">
              Submit Application
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
