"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import ChatWidget from "./ChatWidget";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Single fixed wrapper — prevents white gap between utility bar and nav */}
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">

      {/* Top Utility Bar */}
      <div className="bg-brand-dark/80 backdrop-blur-sm text-brand-white text-xs font-sans border-b border-brand-white/10">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/visa" className="hover:text-brand-sand transition-colors uppercase tracking-widest font-bold">e-Visa &amp; Entry</Link>
            <Link href="/stories" className="hover:text-brand-sand transition-colors uppercase tracking-widest hidden md:block">Stories</Link>
            <Link href="/routes" className="hover:text-brand-sand transition-colors uppercase tracking-widest hidden md:block">Routes</Link>
            <Link href="/travel-trade" className="hover:text-brand-sand transition-colors uppercase tracking-widest hidden md:block">Travel Trade</Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:text-brand-sand transition-colors uppercase tracking-widest font-bold flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2c-.2 2.2-.4 4.8-.4 8 0 3.2.2 5.8.4 8M12 2c.2 2.2.4 4.8.4 8 0 3.2-.2 5.8-.4 8M2 12h20"></path>
              </svg> EN
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      {/* Main Navigation — sits inside the fixed wrapper, no extra fixed needed */}
      <header className={`w-full py-4 transition-all duration-300 ${scrolled ? "bg-brand-dark shadow-lg" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-brand-white">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-heading text-3xl font-bold uppercase tracking-wide drop-shadow-lg">
            <Image src="/logo-white.png" alt="Roodh.ways Logo" width={32} height={32} className="object-contain" />
            <span className="hidden sm:inline-block">roodh.ways</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-sans font-semibold uppercase tracking-wider text-sm drop-shadow">
            <Link href="/destinations" className="hover:text-brand-sand transition-colors">Destinations</Link>
            <Link href="/experiences" className="hover:text-brand-sand transition-colors">Experiences</Link>
            <Link href="/passport-kit" className="hover:text-brand-sand transition-colors text-brand-blue">The Kit</Link>
            <Link href="/international" className="hover:text-brand-sand transition-colors">International</Link>
            <Link href="/plan" className="hover:text-brand-sand transition-colors">Plan A Trip</Link>
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <Link href="/plan" className="hidden lg:flex items-center justify-center border-2 border-brand-white rounded-full px-6 py-2 text-sm font-bold uppercase tracking-wider hover:bg-brand-white hover:text-brand-dark transition-all drop-shadow">
              Get Inspired
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 p-2" aria-label="Toggle menu">
              <span className="block w-6 h-0.5 bg-brand-white"></span>
              <span className="block w-6 h-0.5 bg-brand-white"></span>
              <span className="block w-6 h-0.5 bg-brand-white"></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-brand-dark/95 backdrop-blur-md text-brand-white px-6 py-6 flex flex-col gap-4 font-sans font-semibold uppercase tracking-wider text-sm">
            <Link href="/destinations" onClick={() => setMenuOpen(false)}>Destinations</Link>
            <Link href="/experiences" onClick={() => setMenuOpen(false)}>Experiences</Link>
            <Link href="/passport-kit" onClick={() => setMenuOpen(false)} className="text-brand-blue">The Kit</Link>
            <Link href="/international" onClick={() => setMenuOpen(false)}>International</Link>
            <Link href="/routes" onClick={() => setMenuOpen(false)}>Routes</Link>
            <Link href="/plan" onClick={() => setMenuOpen(false)}>Plan A Trip</Link>
            <Link href="/visa" onClick={() => setMenuOpen(false)}>e-Visa &amp; Entry</Link>
          </div>
        )}
      </header>

      </div>{/* end fixed wrapper */}

      {/* Chat Widget — outside wrapper so it doesn't affect header height */}
      <ChatWidget />
    </>
  );
}

