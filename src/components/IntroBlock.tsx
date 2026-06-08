import React from "react";
import FadeIn from "@/components/FadeIn";

export default function IntroBlock() {
  return (
    <section className="w-full bg-brand-white py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <FadeIn delay={0}>
          <p className="text-brand-blue font-sans font-bold uppercase tracking-widest text-sm mb-6">
            Welcome to roodh.ways
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="font-heading text-5xl md:text-7xl font-black uppercase tracking-tighter text-brand-dark leading-none mb-8">
            Your Dream Trip<br />Starts Here
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="font-sans text-brand-dark/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12">
            India is not a destination — it is an experience. From snow-capped peaks to sun-soaked shores, from ancient temples to modern cities, let us guide you through the most diverse country on earth.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-brand-dark text-brand-white px-8 py-4 rounded-full font-heading uppercase tracking-wider font-bold hover:bg-brand-blue transition-colors">
              Start Exploring
            </button>
            <button className="border-2 border-brand-dark text-brand-dark px-8 py-4 rounded-full font-heading uppercase tracking-wider font-bold hover:border-brand-blue hover:text-brand-blue transition-colors">
              View All Destinations
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

