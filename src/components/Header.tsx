"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";

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
            <Link href="/travel-trade" className="hover:text-brand-sand transition-colors uppercase tracking-widest hidden md:block">Travel Trade</Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:text-brand-sand transition-colors uppercase tracking-widest font-bold flex items-center gap-1">
              <span>🌐</span> EN
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      {/* Main Navigation — sits inside the fixed wrapper, no extra fixed needed */}
      <header className={`w-full py-4 transition-all duration-300 ${scrolled ? "bg-brand-dark shadow-lg" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-brand-white">
          {/* Logo */}
          <Link href="/" className="font-heading text-3xl font-bold uppercase tracking-wide drop-shadow-lg">
            roodh.ways
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-sans font-semibold uppercase tracking-wider text-sm drop-shadow">
            <Link href="/destinations" className="hover:text-brand-sand transition-colors">Destinations</Link>
            <Link href="/experiences" className="hover:text-brand-sand transition-colors">Experiences</Link>
            <Link href="/plan" className="hover:text-brand-sand transition-colors">Plan A Trip</Link>
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <Link href="#plan" className="hidden lg:flex items-center justify-center border-2 border-brand-white rounded-full px-6 py-2 text-sm font-bold uppercase tracking-wider hover:bg-brand-white hover:text-brand-dark transition-all drop-shadow">
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
            <Link href="/plan" onClick={() => setMenuOpen(false)}>Plan A Trip</Link>
            <Link href="#visa" onClick={() => setMenuOpen(false)}>e-Visa &amp; Entry</Link>
          </div>
        )}
      </header>

      </div>{/* end fixed wrapper */}

      {/* AI Floating Widget — outside wrapper so it doesn't affect header height */}
      <div className="fixed bottom-8 right-6 z-50">
        <button className="bg-brand-rust text-brand-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform text-2xl" aria-label="AI Trip Planner">
          ✨
        </button>
        <span className="absolute -top-8 right-0 bg-brand-dark text-brand-white text-xs px-3 py-1 rounded-full whitespace-nowrap font-sans font-bold hidden group-hover:block">
          AI Planner
        </span>
      </div>
    </>
  );
}

