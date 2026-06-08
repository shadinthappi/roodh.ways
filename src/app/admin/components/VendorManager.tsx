"use client";

import React, { useState, useEffect } from "react";

export default function VendorManager() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: "", category: "Hotel", contactPerson: "", email: "", phone: "", contractRates: "", notes: "" });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await fetch("/api/admin/vendors");
      if (res.ok) {
        setVendors(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(false);
    const newVendor = {
      _type: "vendor",
      ...formData
    };

    // Optimistic update
    setVendors([...vendors, { _id: Date.now().toString(), ...newVendor }]);

    try {
      await fetch("/api/admin/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mutations: [{ create: newVendor }] })
      });
      fetchVendors();
    } catch (e) {
      alert("Failed to add vendor");
    }
  };

  const handleDeleteVendor = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    // Optimistic update
    setVendors(vendors.filter(v => v._id !== id));

    try {
      await fetch("/api/admin/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mutations: [{ delete: { id } }] })
      });
    } catch (e) {
      alert("Failed to delete vendor");
      fetchVendors(); // revert
    }
  };

  if (isLoading) return <div className="py-20 text-center text-sm font-bold uppercase text-brand-dark/50">Loading Vendors...</div>;

  return (
    <div className="bg-brand-white border border-brand-dark/10 rounded-2xl p-8 shadow-sm">
      <div className="flex justify-between items-center mb-8 border-b border-brand-dark/10 pb-4">
        <h3 className="text-lg font-bold uppercase tracking-wider text-brand-dark">Vendor Directory</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-brand-blue text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-dark transition-colors"
        >
          {isAdding ? "Cancel" : "+ Add Vendor"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddVendor} className="mb-8 bg-brand-offwhite p-6 rounded-xl border border-brand-dark/10 animate-[fadeIn_0.2s_ease-out]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input required placeholder="Vendor Name *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="px-4 py-2 rounded-lg border border-brand-dark/10 text-sm focus:outline-brand-blue" />
            <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="px-4 py-2 rounded-lg border border-brand-dark/10 text-sm focus:outline-brand-blue bg-white">
              <option>Hotel</option>
              <option>Transport / Driver</option>
              <option>Tour Guide</option>
              <option>Flight Agent</option>
              <option>Other</option>
            </select>
            <input placeholder="Contact Person" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="px-4 py-2 rounded-lg border border-brand-dark/10 text-sm focus:outline-brand-blue" />
            <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="px-4 py-2 rounded-lg border border-brand-dark/10 text-sm focus:outline-brand-blue" />
            <input type="tel" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="px-4 py-2 rounded-lg border border-brand-dark/10 text-sm focus:outline-brand-blue" />
            <input placeholder="Contract Rates Link (e.g. Google Drive)" value={formData.contractRates} onChange={e => setFormData({...formData, contractRates: e.target.value})} className="px-4 py-2 rounded-lg border border-brand-dark/10 text-sm focus:outline-brand-blue" />
          </div>
          <textarea placeholder="Internal Notes..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-brand-dark/10 text-sm focus:outline-brand-blue mb-4 h-20 resize-none" />
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-green-700 transition-colors">Save Vendor</button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-dark/10">
              <th className="py-3 px-4 text-xs font-black uppercase tracking-widest text-brand-dark/50">Name</th>
              <th className="py-3 px-4 text-xs font-black uppercase tracking-widest text-brand-dark/50">Category</th>
              <th className="py-3 px-4 text-xs font-black uppercase tracking-widest text-brand-dark/50">Contact</th>
              <th className="py-3 px-4 text-xs font-black uppercase tracking-widest text-brand-dark/50">Rates</th>
              <th className="py-3 px-4 text-xs font-black uppercase tracking-widest text-brand-dark/50 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v._id} className="border-b border-brand-dark/5 hover:bg-brand-offwhite/50 transition-colors">
                <td className="py-4 px-4">
                  <div className="font-bold text-sm text-brand-dark">{v.name}</div>
                  {v.notes && <div className="text-[10px] text-brand-dark/50 mt-1 truncate max-w-[200px]">{v.notes}</div>}
                </td>
                <td className="py-4 px-4">
                  <span className="inline-block px-2 py-1 bg-brand-dark/5 rounded text-[10px] font-bold uppercase tracking-wider">{v.category}</span>
                </td>
                <td className="py-4 px-4 text-sm text-brand-dark/80">
                  <div className="font-semibold">{v.contactPerson || "N/A"}</div>
                  <div className="text-[10px] text-brand-dark/50 flex flex-col mt-0.5">
                    {v.phone && <a href={`tel:${v.phone}`} className="hover:text-brand-blue">{v.phone}</a>}
                    {v.email && <a href={`mailto:${v.email}`} className="hover:text-brand-blue">{v.email}</a>}
                  </div>
                </td>
                <td className="py-4 px-4 text-sm">
                  {v.contractRates ? (
                    <a href={v.contractRates} target="_blank" rel="noreferrer" className="text-brand-blue hover:underline font-bold text-[10px] uppercase tracking-wider">View Rates</a>
                  ) : (
                    <span className="text-brand-dark/30 text-[10px] uppercase font-bold tracking-wider">Not Added</span>
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                  <button 
                    onClick={() => handleDeleteVendor(v._id)}
                    title="Delete Vendor"
                    className="inline-flex items-center justify-center w-8 h-8 rounded bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
            {vendors.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm font-medium text-brand-dark/50">No vendors added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
