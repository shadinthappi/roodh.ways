"use client";

import React, { useState, useEffect } from "react";

export default function TrashManager() {
  const [trashedItems, setTrashedItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrash();
  }, []);

  const fetchTrash = async () => {
    try {
      const res = await fetch("/api/admin/trash");
      if (res.ok) {
        setTrashedItems(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await fetch("/api/admin/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mutations: [{ patch: { id, set: { isTrashed: false, trashedAt: null } } }] })
      });
      setTrashedItems(trashedItems.filter(i => i._id !== id));
    } catch (e) {
      alert("Failed to restore item");
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!window.confirm("Are you absolutely sure? This will delete the record permanently from the database.")) return;
    try {
      await fetch("/api/admin/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mutations: [{ delete: { id } }] })
      });
      setTrashedItems(trashedItems.filter(i => i._id !== id));
    } catch (e) {
      alert("Failed to delete item permanently");
    }
  };

  if (isLoading) return <div className="py-20 text-center text-sm font-bold uppercase text-brand-dark/50">Loading Trash...</div>;

  return (
    <div className="bg-brand-white border border-brand-dark/10 rounded-2xl shadow-sm overflow-hidden animate-[fadeIn_0.3s_ease-out]">
      <div className="p-6 border-b border-brand-dark/10 flex justify-between items-center bg-red-50/30">
        <div>
          <h3 className="text-lg font-bold uppercase tracking-wider text-red-600">Trash Bin</h3>
          <p className="text-xs font-medium text-brand-dark/60 mt-1">Items here are automatically deleted permanently after 30 days.</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-dark/10">
              <th className="py-3 px-4 text-xs font-black uppercase tracking-widest text-brand-dark/50">Type</th>
              <th className="py-3 px-4 text-xs font-black uppercase tracking-widest text-brand-dark/50">Details</th>
              <th className="py-3 px-4 text-xs font-black uppercase tracking-widest text-brand-dark/50">Date Deleted</th>
              <th className="py-3 px-4 text-xs font-black uppercase tracking-widest text-brand-dark/50 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trashedItems.map((item) => {
              const isBooking = item._type === "booking";
              const isVendor = item._type === "vendor";
              const typeLabel = isBooking ? (item.status === "Booked" || item.status === "Completed" ? "Ledger" : "Lead") : "Vendor";
              const name = isBooking ? item.customerName : item.name;
              
              // Calculate days left
              const trashedDate = new Date(item.trashedAt);
              const expireDate = new Date(trashedDate);
              expireDate.setDate(expireDate.getDate() + 30);
              const daysLeft = Math.ceil((expireDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));

              return (
                <tr key={item._id} className="border-b border-brand-dark/5 hover:bg-brand-offwhite/50 transition-colors">
                  <td className="py-4 px-4">
                    <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isVendor ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {typeLabel}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-sm text-brand-dark">{name}</div>
                    <div className="text-[10px] text-brand-dark/50 mt-1">{item.email || item.phone || "No contact info"}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm font-semibold text-brand-dark/80">{trashedDate.toLocaleDateString()}</div>
                    <div className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-0.5">{daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}</div>
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <button 
                      onClick={() => handleRestore(item._id)}
                      className="inline-flex items-center justify-center px-3 py-1.5 rounded bg-brand-dark/5 text-brand-dark hover:bg-brand-blue hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
                    >
                      Restore
                    </button>
                    <button 
                      onClick={() => handlePermanentDelete(item._id)}
                      className="inline-flex items-center justify-center px-3 py-1.5 rounded bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
                    >
                      Delete Forever
                    </button>
                  </td>
                </tr>
              );
            })}
            {trashedItems.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-sm font-medium text-brand-dark/50">Trash is empty.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
