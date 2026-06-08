"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, Navigation, Compass, BookOpen, Dice5, User, Users, Briefcase } from "lucide-react";
import Header from "@/components/Header";

// Data structures from brief
const essentials = [
  "Face Mask", "Toilet Seat Cover", "Mini Hand Sanitizer", "Wet Wipes", 
  "Toothpaste Tablet Kit", "Paper Soap Strips", "Wet Towel", "Travel Cutlery Set"
];

const accessories = [
  "Cotton Travel Pouch", "Premium Luggage Tag", "Roodh.ways Sticker Sheet", "Rood Passport"
];

const passportFeatures = [
  "Welcome Note", "Trip Information", "Emergency Contacts", "Playlist QR Codes",
  "Travel Challenges", "Journey Reflection Pages", "Memory Log Pages", 
  "Future Travel Stamp Collection", "Interactive Travel Games"
];

const faqs = [
  { q: "What is included?", a: "The Roodh Explorers Kit™ includes 8 travel essentials, premium branded accessories like a luggage tag and sticker sheet, travel dice, and our signature 14-page Roodh Explorers Passport travel booklet." },
  { q: "Is it reusable?", a: "Absolutely. While consumables like wet wipes and soap strips are single-use, the Cotton Pouch, Cutlery Set, Luggage Tag, Travel Dice, and the Rood Passport itself are designed to be lifelong travel companions." },
  { q: "Can it be customized?", a: "Yes! We offer corporate and bulk customization for groups of 20+. You can add custom logos to the pouch and personalize the Welcome Note inside the Passport." },
  { q: "Is it included with Roodh.ways trips?", a: "Yes! Every traveler who books a Premium or Luxury tier itinerary with Roodh.ways receives a complimentary Roodh Explorers Kit™ delivered before their departure." }
];

export default function PassportKitClient({ footer }: { footer: React.ReactNode }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-brand-white selection:bg-brand-blue selection:text-white overflow-x-hidden">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[90vh] bg-brand-dark flex items-center justify-center pt-24 pb-12 px-6 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-blue/20 via-brand-dark to-brand-dark opacity-70"></div>
          {/* Abstract floating shapes for premium feel */}
          <motion.div 
            animate={{ rotate: 360 }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full border border-brand-blue/10 border-dashed"
          />
          <motion.div 
            animate={{ rotate: -360 }} transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[20%] -left-[10%] w-[80%] h-[80%] rounded-full border border-brand-white/5 border-dotted"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="inline-block border border-brand-blue/30 bg-brand-blue/10 backdrop-blur-md px-6 py-2 rounded-full mb-8"
          >
            <span className="font-sans font-bold uppercase tracking-widest text-xs text-brand-sand">
              The Ultimate Travel Companion
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="font-heading font-black text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-brand-white leading-[0.9] mb-8 drop-shadow-2xl"
          >
            Roodh <span className="text-transparent bg-clip-text bg-gradient-to-br from-brand-blue to-brand-sand">Explorers</span><br/>Kit<span className="text-4xl align-top">™</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="font-sans text-xl md:text-2xl text-brand-white/80 max-w-2xl font-light leading-relaxed mb-12"
          >
            Not just a travel essentials kit. A complete travel experience designed to accompany you before, during, and long after your journey ends.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <button className="bg-brand-blue text-white font-heading font-bold uppercase tracking-wider px-10 py-5 rounded-2xl hover:bg-brand-sand hover:text-brand-dark transition-all shadow-xl hover:shadow-brand-blue/20 hover:-translate-y-1">
              Order Your Kit — ₹199
            </button>
            <button className="bg-transparent border-2 border-brand-white/20 text-brand-white font-heading font-bold uppercase tracking-wider px-10 py-5 rounded-2xl hover:bg-brand-white/10 transition-all">
              Watch Unboxing
            </button>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-brand-white/40"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* 2. PRODUCT OVERVIEW & WHY IT EXISTS */}
      <section className="py-24 px-6 bg-brand-offwhite">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 space-y-8">
            <h2 className="font-heading font-black text-4xl md:text-5xl uppercase tracking-tighter text-brand-dark leading-none">
              More Than Just <br/>
              <span className="text-brand-blue">Essentials.</span>
            </h2>
            <p className="font-sans text-lg text-brand-dark/70 leading-relaxed">
              We noticed a gap in the way people travel. You pack your bags, you book your flights, but the journey itself often lacks a physical anchor. 
            </p>
            <p className="font-sans text-lg text-brand-dark/70 leading-relaxed">
              The Roodh Explorers Kit™ bridges that gap. It combines high-quality hygiene and convenience essentials with interactive storytelling, games, and memory-keeping. It is designed to spark conversations with strangers, keep you entertained during long layovers, and serve as a beautiful journal of your adventures.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              {["Convenience", "Hygiene", "Entertainment", "Memory Keeping"].map((val, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} className="text-brand-blue" />
                  </div>
                  <span className="font-sans font-bold uppercase tracking-wider text-xs text-brand-dark">{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <div className="aspect-square bg-brand-dark/5 rounded-[3rem] rotate-3 absolute inset-0 transition-transform hover:rotate-6"></div>
            <div className="aspect-square bg-brand-white border border-brand-dark/10 shadow-2xl rounded-[3rem] p-12 relative flex items-center justify-center overflow-hidden z-10 group">
              <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              {/* Placeholder for Product Mockup Image */}
              <div className="text-center">
                <Compass size={64} className="mx-auto text-brand-blue mb-6 opacity-80 group-hover:scale-110 transition-transform duration-500" />
                <p className="font-heading font-black text-2xl uppercase text-brand-dark/40 tracking-widest">Premium Canvas Pouch</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT'S INSIDE - THE GRID */}
      <section className="py-24 px-6 bg-brand-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-heading font-black text-5xl md:text-6xl uppercase tracking-tighter text-brand-dark mb-6">
              Inside The Kit
            </h2>
            <p className="font-sans text-xl text-brand-dark/60 max-w-2xl mx-auto">
              Every detail meticulously crafted. From the cotton threads of our travel pouch to the custom-milled travel dice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Essentials Column */}
            <div className="bg-brand-offwhite rounded-3xl p-10 border border-brand-dark/5 hover:border-brand-blue/30 transition-colors group">
              <div className="w-16 h-16 rounded-2xl bg-brand-white flex items-center justify-center shadow-sm mb-8 group-hover:-translate-y-2 transition-transform">
                <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 2v20M9 6h6M8 10h8v12H8z"></path>
                </svg>
              </div>
              <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-brand-dark mb-6">Travel Essentials</h3>
              <ul className="space-y-4">
                {essentials.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 font-sans text-brand-dark/80 font-medium">
                    <CheckCircle2 size={18} className="text-brand-blue shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Accessories Column */}
            <div className="bg-brand-offwhite rounded-3xl p-10 border border-brand-dark/5 hover:border-brand-blue/30 transition-colors group">
              <div className="w-16 h-16 rounded-2xl bg-brand-white flex items-center justify-center shadow-sm mb-8 group-hover:-translate-y-2 transition-transform">
                <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01"></path>
                </svg>
              </div>
              <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-brand-dark mb-6">Branded Accessories</h3>
              <ul className="space-y-4">
                {accessories.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 font-sans text-brand-dark/80 font-medium">
                    <CheckCircle2 size={18} className="text-brand-blue shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* The Box Column */}
            <div className="bg-brand-offwhite rounded-3xl p-10 border border-brand-dark/5 hover:border-brand-blue/30 transition-colors group">
               <div className="w-16 h-16 rounded-2xl bg-brand-white flex items-center justify-center shadow-sm mb-8 group-hover:-translate-y-2 transition-transform">
                <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"></path>
                </svg>
              </div>
              <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-brand-dark mb-6">Inside The Box</h3>
              <p className="font-sans text-brand-dark/80 font-medium mb-6 leading-relaxed">
                The packaging itself is part of the experience, printed inside with interactive board elements.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 font-sans text-brand-dark/80 font-medium">
                  <CheckCircle2 size={18} className="text-brand-blue shrink-0 mt-0.5" />
                  Traveller's Quest Board
                </li>
                <li className="flex items-start gap-3 font-sans text-brand-dark/80 font-medium">
                  <CheckCircle2 size={18} className="text-brand-blue shrink-0 mt-0.5" />
                  Dice Challenge Trail
                </li>
                <li className="flex items-start gap-3 font-sans text-brand-dark/80 font-medium">
                  <CheckCircle2 size={18} className="text-brand-blue shrink-0 mt-0.5" />
                  Custom Travel Dice (Included)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MEET THE PASSPORT (Dark Section) */}
      <section className="py-32 px-6 bg-brand-dark text-brand-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            
            <div className="flex-1 relative z-10 w-full">
              <div className="relative aspect-[3/4] w-full max-w-md mx-auto">
                 {/* Visual Representation of the Passport Booklet */}
                 <motion.div 
                   whileHover={{ rotateY: -15, scale: 1.05 }}
                   transition={{ type: "spring", stiffness: 300, damping: 20 }}
                   className="absolute inset-0 bg-brand-blue rounded-r-3xl rounded-l-lg shadow-[20px_20px_60px_rgba(0,0,0,0.5)] border-l-4 border-brand-dark/50 flex flex-col items-center justify-center p-12 cursor-pointer transform-gpu"
                 >
                   <div className="mb-6 flex justify-center">
                     <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M35 80V20H60C72 20 80 28 80 40C80 48 75 55 67 58L85 80H70L54 60H45V80H35ZM45 50H58C64 50 68 46 68 40C68 34 64 30 58 30H45V50Z" fill="currentColor" className="text-brand-white/90" />
                       <path d="M60 40L40 50L45 35L35 30H50L55 15L60 30H75L65 35L70 50L60 40Z" fill="#B85C38" />
                     </svg>
                   </div>
                   <h3 className="font-heading font-black text-3xl uppercase tracking-widest text-brand-white text-center mb-4 leading-tight">Roodh<br/>Explorers<br/>Passport</h3>
                   <div className="w-16 h-1 bg-brand-sand/50 rounded-full mb-auto mt-4"></div>
                   <div className="text-center font-sans text-xs font-bold uppercase tracking-widest text-brand-white/50">
                     Issue No. 01 / Travel Log
                   </div>
                 </motion.div>
              </div>
            </div>

            <div className="flex-1 space-y-10 z-10">
              <div>
                <h2 className="font-heading font-black text-5xl md:text-6xl uppercase tracking-tighter mb-6">
                  Meet The<br/><span className="text-brand-blue">Roodh Explorers Passport</span>
                </h2>
                <p className="font-sans text-xl text-brand-white/70 leading-relaxed mb-10">
                  A 14-page beautifully bound booklet that serves as your ultimate travel ledger. It's designed to pull you away from your screen and back into the present moment.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {passportFeatures.map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2.5 shrink-0"></div>
                    <span className="font-sans font-semibold text-lg text-brand-white/90">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRAVEL GAMES & INTERACTIVITY */}
      <section className="py-24 px-6 bg-brand-sand relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse gap-16 items-center">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 bg-brand-dark text-brand-white px-4 py-1.5 rounded-full font-sans font-bold uppercase tracking-widest text-xs">
              <Dice5 size={14} /> Play Anywhere
            </div>
            <h2 className="font-heading font-black text-4xl md:text-6xl uppercase tracking-tighter text-brand-dark leading-none">
              Downtime is <br/>Playtime.
            </h2>
            <p className="font-sans text-lg text-brand-dark/80 leading-relaxed font-medium">
              We transformed the inside of the shipping box into interactive board games. Because waiting for trains, long layovers, and quiet nights at the hostel are the perfect times to connect.
            </p>
            
            <div className="space-y-6 pt-6">
              <div className="bg-brand-white/50 p-6 rounded-2xl border border-brand-dark/10">
                <h4 className="font-heading font-bold text-2xl uppercase tracking-tight text-brand-dark mb-2">Traveller's Quest</h4>
                <p className="font-sans text-brand-dark/70 text-sm leading-relaxed">A social interaction game designed to get you out of your comfort zone. Roll the included travel dice and complete the real-world quests written on the board.</p>
              </div>
              <div className="bg-brand-white/50 p-6 rounded-2xl border border-brand-dark/10">
                <h4 className="font-heading font-bold text-2xl uppercase tracking-tight text-brand-dark mb-2">Dice Challenge Trail</h4>
                <p className="font-sans text-brand-dark/70 text-sm leading-relaxed">A fast-paced competitive trail game printed directly inside the packaging. Perfect for groups or making new friends at a cafe.</p>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full grid grid-cols-2 gap-4">
             {/* Abstract representation of the games */}
             <div className="aspect-square bg-brand-dark rounded-3xl p-8 flex flex-col justify-between text-brand-white shadow-xl hover:-translate-y-2 transition-transform">
               <Dice5 size={32} className="text-brand-blue" />
               <span className="font-heading font-black text-3xl uppercase">Roll<br/>The<br/>Dice</span>
             </div>
             <div className="aspect-square bg-brand-white border-2 border-brand-dark rounded-3xl p-8 flex flex-col justify-between text-brand-dark shadow-xl hover:-translate-y-2 transition-transform mt-12">
               <Navigation size={32} className="text-brand-blue" />
               <span className="font-heading font-black text-3xl uppercase">Make<br/>New<br/>Friends</span>
             </div>
          </div>
        </div>
      </section>

      {/* 6. PERFECT FOR... */}
      <section className="py-24 px-6 bg-brand-white">
        <div className="max-w-7xl mx-auto text-center">
           <h2 className="font-heading font-black text-4xl md:text-5xl uppercase tracking-tighter text-brand-dark mb-16">
              Who is it perfect for?
            </h2>
            
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
              {[
                { icon: <User size={18}/>, label: "Solo Travelers" },
                { icon: <Users size={18}/>, label: "Couples" },
                { icon: <Users size={18}/>, label: "Friend Groups" },
                { icon: <Briefcase size={18}/>, label: "Corporate Trips" },
                { icon: <Compass size={18}/>, label: "Backpackers" },
                { icon: <BookOpen size={18}/>, label: "Student Trips" },
              ].map((audience, i) => (
                <div key={i} className="flex items-center gap-3 bg-brand-offwhite border border-brand-dark/10 px-6 py-4 rounded-full hover:bg-brand-blue hover:text-brand-white hover:border-brand-blue transition-colors cursor-default text-brand-dark">
                  {audience.icon}
                  <span className="font-sans font-bold uppercase tracking-wider text-sm">{audience.label}</span>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-24 px-6 bg-brand-offwhite border-t border-brand-dark/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading font-black text-4xl md:text-5xl uppercase tracking-tighter text-brand-dark">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-brand-white border border-brand-dark/10 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-sans font-bold text-lg text-brand-dark pr-8">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} className="text-brand-blue shrink-0">
                    <ChevronDown size={24} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-6 font-sans text-brand-dark/70 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-32 px-6 bg-brand-dark text-brand-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="font-heading font-black text-5xl md:text-7xl uppercase tracking-tighter mb-8">
            Ready to upgrade<br/>your journey?
          </h2>
          <p className="font-sans text-xl text-brand-white/70 mb-12 max-w-2xl mx-auto">
            Order your kit today for your next adventure, or book a Premium trip with us and we will send you one on the house.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="bg-brand-blue text-white font-heading font-bold uppercase tracking-wider px-12 py-5 rounded-2xl hover:bg-brand-sand hover:text-brand-dark transition-all shadow-xl hover:-translate-y-1">
              Buy Kit Now — ₹199
            </button>
            <button className="bg-brand-white text-brand-dark font-heading font-bold uppercase tracking-wider px-12 py-5 rounded-2xl hover:bg-gray-200 transition-all shadow-xl hover:-translate-y-1">
              Explore Our Trips
            </button>
          </div>
        </div>
      </section>

      {footer}
    </main>
  );
}
