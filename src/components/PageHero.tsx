import React from "react";
import FadeIn from "@/components/FadeIn";

interface PageHeroProps {
  label?: string;
  heading: string;
  subheading?: string;
  color?: string;
}

export default function PageHero({ label, heading, subheading, color = "bg-brand-dark" }: PageHeroProps) {
  return (
    <section className={`w-full ${color} pt-32 pb-20 px-6 relative overflow-hidden`}>
      {/* Decorative background lines */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full"
          style={{ backgroundImage: "repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "80px 100%" }} />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        {label && (
          <FadeIn delay={0}>
            <p className="text-brand-rust font-sans font-bold uppercase tracking-widest text-sm mb-6">{label}</p>
          </FadeIn>
        )}
        <FadeIn delay={0.1}>
          <h1 className="font-heading font-black text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-brand-white leading-none mb-6">
            {heading}
          </h1>
        </FadeIn>
        {subheading && (
          <FadeIn delay={0.2}>
            <p className="font-sans text-brand-white/60 text-lg md:text-xl max-w-2xl">{subheading}</p>
          </FadeIn>
        )}
        <FadeIn delay={0.3}>
          <div className="mt-12 h-1 w-24 bg-brand-rust rounded-full" />
        </FadeIn>
      </div>
    </section>

  );
}
