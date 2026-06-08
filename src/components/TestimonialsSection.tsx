import React from "react";
import FadeIn from "./FadeIn";

const testimonials = [
  {
    name: "Eleanor Rigby",
    location: "London, UK",
    text: "roodh.ways completely transformed how I see India. Every detail was curated to perfection, giving me access to places I would never have found on my own.",
    rating: 5,
  },
  {
    name: "James & Sarah",
    location: "Sydney, AU",
    text: "From the serene backwaters of Kerala to the bustling markets of Delhi, our trip was flawless. The guides were exceptionally knowledgeable.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    location: "Toronto, CA",
    text: "A truly premium experience. The accommodations, the seamless transitions between cities, and the deep cultural immersion were beyond expectations.",
    rating: 5,
  }
];

export default function TestimonialsSection() {
  return (
    <section className="w-full bg-brand-sand/10 py-24 px-6 border-y border-brand-sand/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <FadeIn>
            <p className="text-brand-blue font-sans font-bold uppercase tracking-widest text-sm mb-4">Traveler Stories</p>
            <h2 className="font-heading text-4xl md:text-5xl font-black uppercase tracking-tighter text-brand-dark">
              Words From<br />Our Guests
            </h2>
          </FadeIn>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <FadeIn key={i} delay={i * 0.1} direction="up">
              <div className="bg-brand-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow h-full flex flex-col relative overflow-hidden group">
                <div className="absolute top-4 right-6 text-brand-blue/5 font-heading text-8xl leading-none group-hover:text-brand-blue/10 transition-colors">"</div>
                <div className="flex gap-1 mb-6 relative z-10">
                  {[...Array(t.rating)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-brand-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="font-sans text-brand-dark/70 leading-relaxed flex-grow relative z-10 mb-8 italic">
                  "{t.text}"
                </p>
                <div className="relative z-10">
                  <h4 className="font-heading font-bold text-lg uppercase tracking-wide text-brand-dark">{t.name}</h4>
                  <p className="font-sans text-xs uppercase tracking-widest text-brand-dark/40">{t.location}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
