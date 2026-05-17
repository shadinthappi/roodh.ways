import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Newsletter Section */}
        <div className="lg:col-span-2 bg-brand-sand/10 p-8 rounded-2xl border border-brand-sand/20">
          <h3 className="font-heading text-2xl font-bold uppercase mb-4 text-brand-sand">Sign up for our newsletter</h3>
          <p className="font-sans mb-6 text-brand-offwhite opacity-80">
            Get the latest travel tips, exclusive offers, and inspiration for your next journey to India.
          </p>
          <form className="flex gap-4">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="flex-1 bg-transparent border-b border-brand-white/30 py-2 focus:outline-none focus:border-brand-sand transition-colors font-sans"
            />
            <button type="submit" className="bg-brand-rust hover:bg-brand-rust/90 text-brand-white px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm transition-colors">
              Subscribe
            </button>
          </form>
        </div>

        {/* Links Column 1 */}
        <div>
          <h4 className="font-heading text-xl uppercase mb-6 text-brand-sand">Explore</h4>
          <ul className="flex flex-col gap-4 font-sans text-brand-offwhite opacity-80">
            <li><Link href="#" className="hover:text-brand-sand transition-colors">Destinations</Link></li>
            <li><Link href="#" className="hover:text-brand-sand transition-colors">Experiences</Link></li>
            <li><Link href="#" className="hover:text-brand-sand transition-colors">Trip Planner</Link></li>
            <li><Link href="#" className="hover:text-brand-sand transition-colors">Travel Trade</Link></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h4 className="font-heading text-xl uppercase mb-6 text-brand-sand">Information</h4>
          <ul className="flex flex-col gap-4 font-sans text-brand-offwhite opacity-80">
            <li><Link href="#" className="hover:text-brand-sand transition-colors">About Us</Link></li>
            <li><Link href="#" className="hover:text-brand-sand transition-colors">Visa & Entry</Link></li>
            <li><Link href="#" className="hover:text-brand-sand transition-colors">Contact</Link></li>
            <li><Link href="#" className="hover:text-brand-sand transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-brand-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-heading text-2xl font-bold uppercase tracking-wide">
          roodh.ways
        </div>
        <div className="font-sans text-sm text-brand-white/50">
          © {new Date().getFullYear()} roodh.ways. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
