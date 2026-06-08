import React from "react";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";

interface PageHeroProps {
  label?: string;
  heading: string;
  subheading?: string;
  color?: string;
  bgImage?: string;
}

export default function PageHero({ label, heading, subheading, color = "bg-brand-dark", bgImage }: PageHeroProps) {
  return (
    <section className={`w-full ${bgImage ? "bg-brand-dark" : color} pt-40 pb-28 px-6 relative overflow-hidden min-h-[500px] flex items-center`}>
      {/* Background Image */}
      {bgImage && (
        <>
          <Image
            src={bgImage}
            alt={heading}
            fill unoptimized
            className="object-cover z-0"
            quality={90}
            priority
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/60 to-transparent z-0" />
          <div className="absolute inset-0 bg-brand-dark/30 z-0" />
        </>
      )}

      {/* Decorative background lines (only show if no image) */}
      {!bgImage && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full"
            style={{ backgroundImage: "repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "80px 100%" }} />
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full relative z-10 mt-10">
        {label && (
          <FadeIn delay={0}>
            <p className="text-brand-blue font-sans font-bold uppercase tracking-widest text-sm mb-6">{label}</p>
          </FadeIn>
        )}
        <FadeIn delay={0.1}>
          <h1 className="font-heading font-black text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-white leading-none mb-6 drop-shadow-lg">
            {heading}
          </h1>
        </FadeIn>
        {subheading && (
          <FadeIn delay={0.2}>
            <p className="font-sans text-white/80 text-lg md:text-xl max-w-2xl drop-shadow-md">{subheading}</p>
          </FadeIn>
        )}
        <FadeIn delay={0.3}>
          <div className="mt-12 h-1 w-24 bg-brand-blue rounded-full" />
        </FadeIn>
      </div>
    </section>
  );
}
