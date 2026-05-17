"use client";
import React, { useState } from "react";

const faqs = [
  { q: "Do I need a visa to travel to India?", a: "Most foreign nationals require a visa to enter India. India offers an e-Visa facility for citizens of over 160 countries, which can be applied online before travel." },
  { q: "What is the best time to visit India?", a: "October to March is generally considered the best time to visit India, when the weather is cooler and more pleasant. However, different regions have different ideal seasons." },
  { q: "Is India safe for solo travelers?", a: "India is generally safe for travelers. As with any destination, it is advisable to stay aware of your surroundings, keep your belongings secure, and research your specific destinations beforehand." },
  { q: "What currency is used in India?", a: "The Indian Rupee (INR) is the official currency. ATMs are widely available in cities and towns. Credit cards are accepted in most hotels and larger establishments." },
  { q: "What vaccinations do I need before visiting?", a: "Consult your doctor or a travel health clinic at least 4–6 weeks before departure. Common recommendations include Hepatitis A, Typhoid, and ensuring routine vaccinations are up to date." },
];

export default function VisaFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="visa" className="w-full bg-brand-dark text-brand-white py-24 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">

        {/* Left: Visa Info Block */}
        <div className="w-full lg:w-2/5 flex flex-col justify-center">
          <p className="text-brand-rust font-sans font-bold uppercase tracking-widest text-sm mb-6">Plan Ahead</p>
          <h2 className="font-heading text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-8">
            e-Visa &<br />Entry Info
          </h2>
          <p className="font-sans text-brand-white/70 text-lg leading-relaxed mb-10">
            India's e-Visa system makes it simple to get your travel authorization online before you fly. Find everything you need to know about entry requirements, visa types, and travel documentation.
          </p>
          <div className="flex flex-col gap-4">
            <a href="#" className="w-fit bg-brand-rust hover:bg-brand-rust/80 text-brand-white px-8 py-4 rounded-full font-heading uppercase tracking-wider font-bold transition-colors">
              Apply for e-Visa
            </a>
            <a href="#" className="w-fit border-2 border-brand-white/30 hover:border-brand-sand text-brand-white px-8 py-4 rounded-full font-heading uppercase tracking-wider font-bold transition-colors">
              Entry Requirements
            </a>
          </div>

          {/* Info chips */}
          <div className="mt-12 flex flex-wrap gap-3">
            {["160+ Countries", "72-hr Processing", "Multiple Entry", "Tourist & Business"].map((chip) => (
              <span key={chip} className="bg-brand-white/10 border border-brand-white/20 text-brand-sand text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full font-sans">
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Right: FAQ Accordion */}
        <div className="w-full lg:w-3/5">
          <p className="text-brand-sand font-heading text-2xl uppercase tracking-wider font-bold mb-8">Frequently Asked</p>
          <div className="flex flex-col divide-y divide-brand-white/10">
            {faqs.map((faq, i) => (
              <div key={i} className="py-6">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex justify-between items-center text-left gap-6 group"
                >
                  <span className="font-sans font-semibold text-lg group-hover:text-brand-sand transition-colors">{faq.q}</span>
                  <span className={`text-brand-sand text-2xl font-bold shrink-0 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {open === i && (
                  <p className="mt-4 font-sans text-brand-white/70 leading-relaxed text-base">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
