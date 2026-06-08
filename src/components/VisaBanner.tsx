import React from "react";
import Image from "next/image";

export default function VisaBanner() {
  return (
    <section className="w-full bg-brand-white flex flex-col md:flex-row overflow-hidden border-t-8 border-brand-blue">
      {/* Text Block */}
      <div className="w-full md:w-1/3 bg-brand-blue text-brand-white p-12 lg:p-20 flex flex-col justify-center">
        <h2 className="font-heading text-4xl lg:text-6xl uppercase font-bold tracking-wide mb-6">
          E-Visa & Entry Details
        </h2>
        <p className="font-sans text-lg lg:text-xl font-medium mb-10 opacity-90">
          Everything you need to know about traveling to India, from e-visas to customs requirements.
        </p>
        <button className="self-start border-2 border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-blue px-8 py-3 rounded-full font-heading uppercase tracking-widest font-bold transition-colors">
          Learn More
        </button>
      </div>
      
      {/* Image Slider/Grid */}
      <div className="w-full md:w-2/3 bg-brand-sand flex p-8 gap-4 overflow-x-auto snap-x hide-scrollbar">
        {/* Placeholder cards for horizontal scroll */}
        {[1, 2, 3].map((item) => (
          <div key={item} className="snap-center min-w-[300px] md:min-w-[400px] h-[300px] md:h-[450px] relative rounded-lg overflow-hidden group cursor-pointer shadow-lg shrink-0">
             <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-colors z-10"></div>
             {/* If we had images we would place them here. We'll use a solid color fallback for now */}
             <div className="absolute inset-0 bg-brand-dark flex items-end p-8">
                <h3 className="text-brand-white font-heading text-2xl uppercase tracking-widest z-20">Travel Update {item}</h3>
             </div>
          </div>
        ))}
      </div>
    </section>
  );
}
