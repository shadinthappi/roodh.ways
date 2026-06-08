"use client";

import React, { useEffect, useState } from "react";
import SettingsForm from "./SettingsForm";

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const query = encodeURIComponent(`*[_type == "siteSettings"][0]`);
        const res = await fetch(`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2023-01-01/data/query/${process.env.NEXT_PUBLIC_SANITY_DATASET}?query=${query}`);
        
        if (res.ok) {
          const data = await res.json();
          setSettings(data.result || { _type: "siteSettings", _id: "siteSettings" });
        }
      } catch (err) {
        console.error("Failed to fetch site settings", err);
        setSettings({ _type: "siteSettings", _id: "siteSettings" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-brand-offwhite">
      {/* Header */}
      <header className="h-20 shrink-0 border-b border-brand-dark/10 bg-brand-white px-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tighter text-brand-dark">Site Settings</h1>
          <p className="text-sm font-sans text-brand-dark/60 font-medium">Manage global website configurations and hero images.</p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto bg-brand-white rounded-2xl border border-brand-dark/10 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-brand-blue/20 border-t-brand-blue animate-spin" />
              <p className="mt-4 text-xs font-bold text-brand-dark/50 uppercase tracking-widest">Loading Settings...</p>
            </div>
          ) : (
            <SettingsForm initialData={settings} />
          )}
        </div>
      </main>
    </div>
  );
}
