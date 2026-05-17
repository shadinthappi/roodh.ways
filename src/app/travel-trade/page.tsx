import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

const benefits = [
  { icon: "🤝", title: "Co-op Marketing", desc: "Access our library of premium India travel assets, campaign toolkits, and brand resources to grow your business." },
  { icon: "📊", title: "Market Intelligence", desc: "Get access to exclusive travel trend reports, visitor statistics, and market insights to power your strategy." },
  { icon: "🎓", title: "Training & Education", desc: "Enrol your agents in our India Specialist Program — a free online certification covering destinations, culture, and logistics." },
  { icon: "🌐", title: "Global Network", desc: "Connect with a network of Indian tourism boards, hotels, tour operators, and ground handlers across all regions." },
];

const partnerTypes = [
  { type: "Tour Operators", desc: "Design and sell India itineraries with confidence using our destination resources and specialist support.", icon: "🗺" },
  { type: "Travel Agents", desc: "Get certified as an India Specialist and access exclusive deals, FAM trip opportunities, and client resources.", icon: "💼" },
  { type: "Media & Influencers", desc: "Partner with roodh.ways for press trips, content collaborations, and media hosting across India.", icon: "📸" },
  { type: "Airlines & Hotels", desc: "Collaborate on joint marketing campaigns to drive inbound travel demand and grow your India footprint.", icon: "✈️" },
];

export default function TravelTradePage() {
  return (
    <main className="min-h-screen bg-brand-white">
      <Header />
      <PageHero
        label="Trade Partners"
        heading="Travel Trade"
        subheading="Grow your India business with tools, resources, and partnerships from roodh.ways."
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
              <div key={b.title} className="bg-brand-white p-8 rounded-2xl shadow-sm border border-brand-dark/5 hover:border-brand-rust transition-colors group">
                <div className="text-4xl mb-4">{b.icon}</div>
                <h3 className="font-heading text-xl font-bold uppercase tracking-tight text-brand-dark mb-3 group-hover:text-brand-rust transition-colors">{b.title}</h3>
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
                <div className="text-4xl mb-4">{p.icon}</div>
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
          <p className="text-brand-rust font-sans font-bold uppercase tracking-widest text-sm mb-6">Get Started</p>
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
            <button type="submit" className="mt-6 self-start bg-brand-dark hover:bg-brand-rust text-brand-white px-10 py-4 rounded-full font-heading uppercase tracking-wider font-bold transition-colors">
              Submit Application
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
