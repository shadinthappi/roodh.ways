import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

const visaTypes = [
  { name: "e-Tourist Visa", duration: "30 days / 1 year / 5 years", icon: "🏖", desc: "For leisure, sightseeing, and recreation. Available to citizens of 160+ countries." },
  { name: "e-Business Visa", duration: "1 year", icon: "💼", desc: "For business meetings, trade, and conferences. Multiple entry permitted." },
  { name: "e-Medical Visa", duration: "60 days", icon: "🏥", desc: "For medical treatment at recognized hospitals. Triple entry permitted." },
  { name: "e-Conference Visa", duration: "30 days", icon: "🎤", desc: "For attending international conferences and seminars recognized by the Government of India." },
];

const steps = [
  { step: "01", title: "Apply Online", desc: "Visit the official Indian e-Visa portal and fill out the application form. The process takes approximately 10–15 minutes." },
  { step: "02", title: "Upload Documents", desc: "Submit a scanned passport copy, a recent photograph, and any supporting documents required for your visa type." },
  { step: "03", title: "Pay the Fee", desc: "Pay the visa fee securely online. Fees vary by nationality and visa type. Payment is non-refundable." },
  { step: "04", title: "Receive Your e-Visa", desc: "Your e-Visa is emailed to you within 72 hours. Print it and carry it with your passport when you travel." },
];

export default function VisaPage() {
  return (
    <main className="min-h-screen bg-brand-white">
      <Header />
      <PageHero
        label="Travel Essentials"
        heading="e-Visa & Entry"
        subheading="Everything you need to know about visiting India — from visa types to entry requirements and customs."
      />

      {/* Visa Types */}
      <section className="bg-brand-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-5xl font-black uppercase tracking-tighter text-brand-dark mb-4">Visa Types</h2>
          <p className="font-sans text-brand-dark/60 mb-12 max-w-2xl">India offers several e-Visa categories depending on the purpose of your visit. Choose the one that fits your travel plans.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visaTypes.map((v) => (
              <div key={v.name} className="bg-brand-offwhite rounded-2xl p-8 border border-brand-dark/5 hover:border-brand-rust transition-colors group">
                <div className="text-4xl mb-4">{v.icon}</div>
                <p className="text-brand-rust font-sans text-xs font-bold uppercase tracking-widest mb-2">{v.duration}</p>
                <h3 className="font-heading text-xl font-bold uppercase tracking-tight text-brand-dark mb-3 group-hover:text-brand-rust transition-colors">{v.name}</h3>
                <p className="font-sans text-brand-dark/60 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="bg-brand-dark py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-5xl font-black uppercase tracking-tighter text-brand-white mb-12">How to Apply</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="relative">
                <div className="font-heading text-7xl font-black text-brand-rust/20 leading-none mb-4">{s.step}</div>
                <h3 className="font-heading text-xl font-bold uppercase tracking-tight text-brand-white mb-3">{s.title}</h3>
                <p className="font-sans text-brand-white/60 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <a href="https://indianvisaonline.gov.in" target="_blank" rel="noopener noreferrer"
              className="inline-block bg-brand-rust hover:bg-brand-rust/80 text-brand-white px-10 py-4 rounded-full font-heading uppercase tracking-wider font-bold transition-colors">
              Apply for e-Visa →
            </a>
          </div>
        </div>
      </section>

      {/* Entry Requirements */}
      <section className="bg-brand-offwhite py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-5xl font-black uppercase tracking-tighter text-brand-dark mb-10">Entry Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🛂", title: "Passport Validity", desc: "Your passport must be valid for at least 6 months beyond your date of arrival in India." },
              { icon: "💉", title: "Health & Vaccination", desc: "No mandatory vaccinations are required, though Hepatitis A, Typhoid, and routine vaccines are recommended." },
              { icon: "💰", title: "Customs & Currency", desc: "You may bring up to ₹25,000 in Indian currency. Foreign currency up to USD 5,000 need not be declared." },
            ].map((item) => (
              <div key={item.title} className="bg-brand-white p-8 rounded-2xl shadow-sm border border-brand-dark/5">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-heading text-2xl font-bold uppercase tracking-tight text-brand-dark mb-3">{item.title}</h3>
                <p className="font-sans text-brand-dark/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
