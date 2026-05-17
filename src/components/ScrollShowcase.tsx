import React from "react";

export default function ScrollShowcase() {
  return (
    <section className="w-full bg-brand-dark text-brand-white flex flex-col md:flex-row">
      {/* Sticky Text Side */}
      <div className="w-full md:w-1/2 p-12 lg:p-24 md:sticky top-0 h-auto md:h-screen flex flex-col justify-center border-r border-brand-white/10">
        <h2 className="font-heading text-5xl lg:text-7xl uppercase font-black tracking-tighter mb-8 leading-none">
          Explore<br/>Your Way
        </h2>
        <p className="font-sans text-lg text-brand-offwhite opacity-80 max-w-md mb-12">
          From the soaring peaks of the Himalayas to the sun-kissed beaches of Goa, craft a journey as unique as you are.
        </p>
        <div className="flex gap-4">
           <button className="bg-brand-sand text-brand-dark hover:bg-brand-white px-8 py-4 rounded-full font-heading font-bold uppercase tracking-wider transition-colors shadow-lg">
             See Destinations
           </button>
        </div>
      </div>

      {/* Scrolling Content Side */}
      <div className="w-full md:w-1/2 flex flex-col">
        {[
          { title: "The Golden Triangle", desc: "Delhi, Agra, and Jaipur.", color: "bg-brand-rust" },
          { title: "Serene South", desc: "Kerala and Tamil Nadu.", color: "bg-[#2A3B4C]" },
          { title: "Himalayan High", desc: "Leh, Ladakh, and Himachal.", color: "bg-[#4B5E4A]" }
        ].map((item, index) => (
          <div key={index} className={`w-full h-[60vh] md:h-screen ${item.color} p-12 flex flex-col justify-end relative overflow-hidden group`}>
            {/* Dark Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
            
            <div className="relative z-10 transform group-hover:-translate-y-4 transition-transform duration-500">
              <h3 className="font-heading text-4xl lg:text-5xl uppercase font-bold tracking-wider mb-2">
                {item.title}
              </h3>
              <p className="font-sans text-brand-sand text-xl uppercase tracking-widest font-bold">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
