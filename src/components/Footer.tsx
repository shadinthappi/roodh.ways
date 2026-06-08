import Link from "next/link";
import React from "react";
import { sanityFetch } from "@/sanity/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

// SVG Icons
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 19.5 12 19.5 12 19.5s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

export default async function Footer() {
  const settings = await sanityFetch<any>(SITE_SETTINGS_QUERY).catch(() => null);

  return (
    <footer className="bg-brand-dark text-brand-white pt-20 pb-10 relative">
      {/* Decorative Top Border */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-sand to-transparent opacity-50" />
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
            <button type="submit" className="bg-brand-blue hover:bg-brand-blue/90 text-brand-white px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm transition-colors">
              Subscribe
            </button>
          </form>
        </div>

        {/* Links Column 1 */}
        <div>
          <h4 className="font-heading text-xl uppercase mb-6 text-brand-sand">Explore</h4>
          <ul className="flex flex-col gap-4 font-sans text-brand-offwhite opacity-80">
            <li><Link href="/destinations" className="hover:text-brand-sand transition-colors">Destinations</Link></li>
            <li><Link href="/experiences" className="hover:text-brand-sand transition-colors">Experiences</Link></li>
            <li><Link href="/plan" className="hover:text-brand-sand transition-colors">Trip Planner</Link></li>
            <li><Link href="/travel-trade" className="hover:text-brand-sand transition-colors">Travel Trade</Link></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h4 className="font-heading text-xl uppercase mb-6 text-brand-sand">Information</h4>
          <ul className="flex flex-col gap-4 font-sans text-brand-offwhite opacity-80">
            <li><Link href="/about" className="hover:text-brand-sand transition-colors">About Us</Link></li>
            <li><Link href="/visa" className="hover:text-brand-sand transition-colors">Visa & Entry</Link></li>
            <li><Link href="/contact" className="hover:text-brand-sand transition-colors">Contact</Link></li>
            {settings?.contactEmail && (
              <li><a href={`mailto:${settings.contactEmail}`} className="hover:text-brand-sand transition-colors">{settings.contactEmail}</a></li>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-brand-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 font-heading text-2xl font-bold uppercase tracking-wide">
          <img src="/logo-white.png" alt="Roodh.ways Logo" width="32" height="32" className="object-contain" />
          roodh.ways
        </div>
        
        {/* Social Links */}
        <div className="flex gap-6 items-center">
          {settings?.instagramUrl && (
            <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-brand-white/50 hover:text-brand-sand hover:scale-110 transition-all" aria-label="Instagram">
              <InstagramIcon />
            </a>
          )}
          {settings?.facebookUrl && (
            <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-brand-white/50 hover:text-brand-sand hover:scale-110 transition-all" aria-label="Facebook">
              <FacebookIcon />
            </a>
          )}
          {settings?.twitterUrl && (
            <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-brand-white/50 hover:text-brand-sand hover:scale-110 transition-all" aria-label="Twitter">
              <TwitterIcon />
            </a>
          )}
          {settings?.youtubeUrl && (
            <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-brand-white/50 hover:text-brand-sand hover:scale-110 transition-all" aria-label="YouTube">
              <YoutubeIcon />
            </a>
          )}
          {settings?.whatsappUrl && (
            <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-brand-white/50 hover:text-brand-sand hover:scale-110 transition-all" aria-label="WhatsApp">
              <WhatsAppIcon />
            </a>
          )}
        </div>

        <div className="font-sans text-sm text-brand-white/50">
          © {new Date().getFullYear()} roodh.ways. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
