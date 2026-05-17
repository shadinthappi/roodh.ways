import React from "react";
import FadeIn from "@/components/FadeIn";

export default function NewsletterSignup() {
  return (
    <section className="w-full flex flex-col md:flex-row min-h-[500px]">
      {/* Left: Scenic Placeholder */}
      <div className="w-full md:w-1/2 bg-[#1B4D3E] relative flex items-center justify-center min-h-[300px] md:min-h-[500px] overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <p className="text-brand-white/20 font-heading text-3xl uppercase tracking-widest">[ Scenic Photo ]</p>
          <p className="text-brand-white/20 font-sans text-sm">Kerala Backwaters at Sunset</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-sand/10" />
      </div>

      {/* Right: Signup Form */}
      <div className="w-full md:w-1/2 bg-brand-sand flex flex-col justify-center px-10 md:px-20 py-20">
        <FadeIn delay={0}>
          <p className="text-brand-rust font-sans font-bold uppercase tracking-widest text-sm mb-6">Newsletter</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter text-brand-dark leading-none mb-6">
            Stay<br />Inspired
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="font-sans text-brand-dark/70 text-lg leading-relaxed mb-10">
            Get exclusive travel guides, hidden gems, seasonal offers, and curated itineraries delivered straight to your inbox.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <form className="flex flex-col gap-4">
            <input type="text" placeholder="Your Name"
              className="bg-transparent border-b-2 border-brand-dark/30 focus:border-brand-dark py-3 font-sans text-brand-dark placeholder-brand-dark/40 focus:outline-none transition-colors" />
            <input type="email" placeholder="Email Address"
              className="bg-transparent border-b-2 border-brand-dark/30 focus:border-brand-dark py-3 font-sans text-brand-dark placeholder-brand-dark/40 focus:outline-none transition-colors" />
            <button type="submit"
              className="mt-4 bg-brand-dark hover:bg-brand-rust text-brand-white px-8 py-4 rounded-full font-heading uppercase tracking-wider font-bold transition-colors self-start">
              Subscribe Now
            </button>
          </form>
        </FadeIn>
        <p className="font-sans text-brand-dark/40 text-xs mt-6">We respect your privacy. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
