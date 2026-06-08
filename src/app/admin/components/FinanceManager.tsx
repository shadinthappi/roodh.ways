"use client";

import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function FinanceManager({ leads }: { leads: any[] }) {
  // Only show Booked or Completed leads in the financial ledger
  const [activeLeads, setActiveLeads] = useState(leads.filter(l => ["Booked", "Completed"].includes(l.status)));
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newBooking, setNewBooking] = useState({ customerName: "", email: "", phone: "", travelDate: "", travelers: 2 });
  
  // Ledger state for editing
  const [costItems, setCostItems] = useState<any[]>([]);
  const [paymentLog, setPaymentLog] = useState<any[]>([]);
  const [markup, setMarkup] = useState(0);
  const [tax, setTax] = useState(0);

  const openLedger = (lead: any) => {
    setSelectedLead(lead);
    setCostItems(lead.costItems || []);
    setPaymentLog(lead.paymentLog || []);
    setMarkup(lead.markupPercentage || 0);
    setTax(lead.taxPercentage || 0);
  };

  const closeLedger = () => {
    setSelectedLead(null);
    setCostItems([]);
    setPaymentLog([]);
    setMarkup(0);
    setTax(0);
  };

  // Calculations
  const calculateTotals = (items: any[], m: number, t: number, payments: any[]) => {
    const baseCost = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const markupAmount = baseCost * (m / 100);
    const subtotal = baseCost + markupAmount;
    const taxAmount = subtotal * (t / 100);
    const finalPrice = subtotal + taxAmount;
    const totalCollected = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const balance = finalPrice - totalCollected;
    const profit = finalPrice - baseCost - taxAmount; // Profit is markup
    const margin = finalPrice > 0 ? (profit / finalPrice) * 100 : 0;
    
    return { baseCost, finalPrice, totalCollected, balance, profit, margin };
  };

  const handleSaveLedger = async () => {
    if (!selectedLead) return;

    const { finalPrice } = calculateTotals(costItems, markup, tax, paymentLog);

    const patch = {
      costItems: costItems.map(c => ({ _key: c._key || Math.random().toString(36).substr(2, 9), ...c })),
      paymentLog: paymentLog.map(p => ({ _key: p._key || Math.random().toString(36).substr(2, 9), ...p })),
      markupPercentage: markup,
      taxPercentage: tax,
      totalPrice: finalPrice, // Sync back to the legacy field for compatibility
      advancePaid: paymentLog.reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
      vendorCosts: costItems.reduce((sum, c) => sum + (Number(c.amount) || 0), 0)
    };

    try {
      await fetch("/api/admin/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mutations: [{ patch: { id: selectedLead._id, set: patch } }] })
      });
      
      const updatedLead = { ...selectedLead, ...patch };
      setActiveLeads(prev => prev.map(l => l._id === updatedLead._id ? updatedLead : l));
      closeLedger();
    } catch (e) {
      alert("Failed to save ledger");
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const doc = {
      _type: "booking",
      ...newBooking,
      status: "Booked",
      durationDays: 1,
    };
    
    try {
      const res = await fetch("/api/admin/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mutations: [{ create: doc }] })
      });
      // Just reload the page for simplicity to fetch the fresh document with its new Sanity ID
      window.location.reload();
    } catch (e) {
      alert("Failed to create booking");
    }
  };

  const handleDeleteLedger = async (id: string) => {
    if (!window.confirm("Are you sure you want to move this ledger to the Trash Folder?")) return;

    try {
      await fetch("/api/admin/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mutations: [{ patch: { id, set: { isTrashed: true, trashedAt: new Date().toISOString() } } }] })
      });
      setActiveLeads(activeLeads.filter(l => l._id !== id));
    } catch (e) {
      alert("Failed to move ledger to trash");
    }
  };

  const generateInvoice = (lead: any) => {
    const doc = new jsPDF();
    const items = lead.costItems || [];
    const pmts = lead.paymentLog || [];
    const mkup = lead.markupPercentage || 0;
    const txx = lead.taxPercentage || 0;
    const { finalPrice, totalCollected, balance } = calculateTotals(items, mkup, txx, pmts);

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138);
    doc.text("ROODH.WAYS", 14, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("hello@roodhways.com", 14, 28);
    doc.text("+91 9876543210", 14, 33);

    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(200, 200, 200);
    doc.text("INVOICE", 140, 25);

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text(`Invoice No: RW-${lead._id.substring(0, 6).toUpperCase()}`, 140, 33);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 38);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 14, 55);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(lead.customerName || "Valued Customer", 14, 62);
    doc.text(lead.email || "", 14, 67);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TRIP DETAILS:", 140, 55);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Travel Date: ${lead.travelDate ? new Date(lead.travelDate).toLocaleDateString() : "TBD"}`, 140, 62);
    doc.text(`Travelers: ${lead.travelers} Pax`, 140, 67);

    autoTable(doc, {
      startY: 85,
      head: [['Description', 'Amount (INR)']],
      body: [
        [`Complete Travel Package (${lead.travelers} Pax)`, `Rs. ${finalPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}`],
        ['Includes all taxes', ''],
      ],
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138] }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount: Rs. ${finalPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}`, 140, finalY);
    doc.setTextColor(34, 197, 94);
    doc.text(`Paid: Rs. ${totalCollected.toLocaleString(undefined, {minimumFractionDigits: 2})}`, 140, finalY + 7);
    doc.setTextColor(239, 68, 68);
    doc.text(`Balance Due: Rs. ${balance.toLocaleString(undefined, {minimumFractionDigits: 2})}`, 140, finalY + 14);

    doc.save(`Invoice_${lead.customerName.replace(/\s+/g, '_')}.pdf`);
  };

  const handleWhatsApp = (lead: any, type: string) => {
    let msg = "";
    const { finalPrice, balance, totalCollected } = calculateTotals(lead.costItems || [], lead.markupPercentage || 0, lead.taxPercentage || 0, lead.paymentLog || []);

    if (type === "invoice") {
      msg = `Hi ${lead.customerName}, your trip with Roodh.ways is confirmed! Your total package cost is ₹${finalPrice.toLocaleString()} and advance paid is ₹${totalCollected.toLocaleString()}. Balance due: ₹${balance.toLocaleString()}. Please let us know if you need the PDF invoice attached.`;
    } else if (type === "payment_reminder") {
      msg = `Hi ${lead.customerName}, this is a gentle reminder regarding your upcoming trip. You have a pending balance of ₹${balance.toLocaleString()}. Please arrange payment at your earliest convenience.`;
    }

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${(lead.phone || "").replace(/\D/g, '')}?text=${encoded}`, '_blank');
  };

  // Dashboard Aggregates
  const totalRevenue = activeLeads.reduce((acc, lead) => acc + calculateTotals(lead.costItems||[], lead.markupPercentage||0, lead.taxPercentage||0, lead.paymentLog||[]).finalPrice, 0);
  const totalCollected = activeLeads.reduce((acc, lead) => acc + calculateTotals(lead.costItems||[], lead.markupPercentage||0, lead.taxPercentage||0, lead.paymentLog||[]).totalCollected, 0);
  const totalPending = totalRevenue - totalCollected;

  return (
    <div className="space-y-8">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-heading font-black uppercase text-brand-dark">Accounts & Ledgers</h3>
          <p className="text-sm text-brand-dark/60 font-medium">Manage booked trips, run cost sheets, and track payments.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-brand-dark text-brand-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-brand-blue transition-colors shadow-lg"
        >
          + Create Manual Booking
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateBooking} className="bg-brand-offwhite p-6 rounded-2xl border border-brand-dark/10 animate-[fadeIn_0.2s_ease-out]">
          <h4 className="text-sm font-black uppercase tracking-widest text-brand-dark mb-4">Manual Entry</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <input required placeholder="Client Name" value={newBooking.customerName} onChange={e => setNewBooking({...newBooking, customerName: e.target.value})} className="px-4 py-2 text-sm rounded-lg border border-brand-dark/10 focus:outline-brand-blue" />
            <input type="email" placeholder="Email" value={newBooking.email} onChange={e => setNewBooking({...newBooking, email: e.target.value})} className="px-4 py-2 text-sm rounded-lg border border-brand-dark/10 focus:outline-brand-blue" />
            <input type="tel" placeholder="Phone" value={newBooking.phone} onChange={e => setNewBooking({...newBooking, phone: e.target.value})} className="px-4 py-2 text-sm rounded-lg border border-brand-dark/10 focus:outline-brand-blue" />
            <input type="date" required value={newBooking.travelDate} onChange={e => setNewBooking({...newBooking, travelDate: e.target.value})} className="px-4 py-2 text-sm rounded-lg border border-brand-dark/10 focus:outline-brand-blue" />
            <input type="number" min="1" placeholder="Pax" value={newBooking.travelers} onChange={e => setNewBooking({...newBooking, travelers: parseInt(e.target.value)})} className="px-4 py-2 text-sm rounded-lg border border-brand-dark/10 focus:outline-brand-blue" />
          </div>
          <div className="flex gap-4">
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-green-700 transition-colors">Save Booking to Ledger</button>
            <button type="button" onClick={() => setIsCreating(false)} className="text-brand-dark/60 font-bold uppercase tracking-widest text-xs hover:text-brand-dark">Cancel</button>
          </div>
        </form>
      )}

      {/* Aggregate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-brand-dark/10 shadow-sm flex flex-col justify-center items-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 mb-1">Total Sales Revenue</p>
          <p className="text-4xl font-heading font-black text-brand-dark">₹{totalRevenue.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-brand-dark/10 shadow-sm flex flex-col justify-center items-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 mb-1">Total Received</p>
          <p className="text-4xl font-heading font-black text-green-600">₹{totalCollected.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-brand-dark/10 shadow-sm flex flex-col justify-center items-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 mb-1">Accounts Receivable</p>
          <p className="text-4xl font-heading font-black text-red-500">₹{totalPending.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
        </div>
      </div>

      {/* Dense ERP Data Grid */}
      <div className="bg-white border border-brand-dark/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-brand-offwhite border-b border-brand-dark/10">
                <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-dark/50">Client Name</th>
                <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-dark/50">Date & Pax</th>
                <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-dark/50">Base Cost</th>
                <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-dark/50">Selling Price</th>
                <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-dark/50">Margin</th>
                <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-dark/50">Collected</th>
                <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-dark/50">Balance</th>
                <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-dark/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeLeads.map((lead) => {
                const { baseCost, finalPrice, totalCollected, balance, margin } = calculateTotals(
                  lead.costItems || [], lead.markupPercentage || 0, lead.taxPercentage || 0, lead.paymentLog || []
                );
                
                const isPaid = finalPrice > 0 && balance <= 0;
                const isPartial = finalPrice > 0 && totalCollected > 0 && balance > 0;

                return (
                  <tr key={lead._id} className="border-b border-brand-dark/5 hover:bg-brand-offwhite/50 transition-colors group text-sm font-medium">
                    <td className="py-4 px-4 text-brand-dark font-bold">{lead.customerName}</td>
                    <td className="py-4 px-4 text-brand-dark/70">
                      {lead.travelDate ? new Date(lead.travelDate).toLocaleDateString() : "TBD"} <span className="text-[10px] bg-brand-dark/5 px-1.5 py-0.5 rounded ml-1">{lead.travelers} Pax</span>
                    </td>
                    <td className="py-4 px-4 text-red-600/80">₹{baseCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                    <td className="py-4 px-4 font-bold text-brand-dark">₹{finalPrice.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                    <td className="py-4 px-4 text-brand-blue font-bold">{margin.toFixed(1)}%</td>
                    <td className="py-4 px-4">
                      {isPaid ? (
                        <span className="text-[10px] font-black uppercase bg-green-100 text-green-700 px-2 py-1 rounded">Fully Paid</span>
                      ) : isPartial ? (
                        <span className="text-[10px] font-black uppercase bg-yellow-100 text-yellow-700 px-2 py-1 rounded">₹{totalCollected.toLocaleString()}</span>
                      ) : (
                        <span className="text-[10px] font-black uppercase bg-brand-dark/5 text-brand-dark/50 px-2 py-1 rounded">Unpaid</span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold text-red-600">
                      {balance > 0 ? `₹${balance.toLocaleString(undefined, {maximumFractionDigits: 0})}` : "-"}
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button 
                        onClick={() => openLedger(lead)}
                        className="text-[10px] font-black uppercase tracking-wider bg-brand-blue text-white px-3 py-1.5 rounded hover:bg-brand-dark transition-colors"
                      >
                        Open Ledger
                      </button>
                      <button 
                        onClick={() => generateInvoice(lead)}
                        title="Download PDF Invoice"
                        className="inline-flex items-center justify-center w-7 h-7 rounded bg-brand-dark/5 hover:bg-brand-blue hover:text-white transition-colors"
                      >
                        📄
                      </button>
                      <button 
                        onClick={() => handleWhatsApp(lead, balance > 0 ? "payment_reminder" : "invoice")}
                        title="WhatsApp Client"
                        className="inline-flex items-center justify-center w-7 h-7 rounded bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                      >
                        💬
                      </button>
                      <button 
                        onClick={() => handleDeleteLedger(lead._id)}
                        title="Delete Ledger"
                        className="inline-flex items-center justify-center w-7 h-7 rounded bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
              {activeLeads.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-sm font-medium text-brand-dark/50">No confirmed bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LEDGER MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm">
          <div className="bg-brand-offwhite rounded-3xl w-full max-w-5xl h-[90vh] shadow-2xl relative border border-brand-dark/20 flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="bg-white px-8 py-5 border-b border-brand-dark/10 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-2xl font-heading font-black uppercase text-brand-dark tracking-tight">{selectedLead.customerName} - Ledger</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-dark/50 mt-1">Ref: {selectedLead._id.substring(0, 8)} • {selectedLead.travelDate ? new Date(selectedLead.travelDate).toLocaleDateString() : "TBD"}</p>
              </div>
              <button onClick={closeLedger} className="w-10 h-10 rounded-full bg-brand-dark/5 hover:bg-brand-dark/10 flex items-center justify-center text-brand-dark transition-colors">
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Cost Sheet */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-brand-dark/10 p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-brand-dark">Cost Sheet (Line Items)</h3>
                    <button 
                      onClick={() => setCostItems([...costItems, { category: "Hotel", description: "", amount: 0 }])}
                      className="text-[10px] font-bold uppercase tracking-widest bg-brand-dark/5 text-brand-dark px-3 py-1.5 rounded hover:bg-brand-dark/10"
                    >
                      + Add Item
                    </button>
                  </div>
                  <div className="space-y-3">
                    {costItems.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-center group">
                        <select 
                          value={item.category} 
                          onChange={(e) => { const n = [...costItems]; n[idx].category = e.target.value; setCostItems(n); }}
                          className="w-32 text-xs p-2 rounded border border-brand-dark/10 bg-white"
                        >
                          <option>Hotel</option><option>Flight</option><option>Transport</option><option>Guide</option><option>Activity</option><option>Other</option>
                        </select>
                        <input 
                          placeholder="Description (e.g. Taj Hotel 2 Nights)" 
                          value={item.description}
                          onChange={(e) => { const n = [...costItems]; n[idx].description = e.target.value; setCostItems(n); }}
                          className="flex-1 text-xs p-2 rounded border border-brand-dark/10"
                        />
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-xs font-bold text-brand-dark/50">₹</span>
                          <input 
                            type="number" 
                            value={item.amount}
                            onChange={(e) => { const n = [...costItems]; n[idx].amount = Number(e.target.value); setCostItems(n); }}
                            className="w-28 text-xs p-2 pl-6 rounded border border-brand-dark/10 font-bold"
                          />
                        </div>
                        <button 
                          onClick={() => { const n = [...costItems]; n.splice(idx, 1); setCostItems(n); }}
                          className="w-8 h-8 rounded bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {costItems.length === 0 && <p className="text-xs text-brand-dark/40 italic">No cost items added yet.</p>}
                  </div>
                  <div className="mt-4 pt-4 border-t border-brand-dark/10 flex justify-end">
                    <p className="text-sm font-bold text-brand-dark uppercase tracking-widest">Base Cost: <span className="text-red-600 ml-2">₹{calculateTotals(costItems, markup, tax, paymentLog).baseCost.toLocaleString()}</span></p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-brand-dark/10 p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-brand-dark">Payment Log</h3>
                    <button 
                      onClick={() => setPaymentLog([...paymentLog, { date: new Date().toISOString().split("T")[0], method: "Bank Transfer", amount: 0, note: "" }])}
                      className="text-[10px] font-bold uppercase tracking-widest bg-brand-dark/5 text-brand-dark px-3 py-1.5 rounded hover:bg-brand-dark/10"
                    >
                      + Add Payment
                    </button>
                  </div>
                  <div className="space-y-3">
                    {paymentLog.map((pmt, idx) => (
                      <div key={idx} className="flex gap-3 items-center group">
                        <input type="date" value={pmt.date} onChange={(e) => { const n = [...paymentLog]; n[idx].date = e.target.value; setPaymentLog(n); }} className="w-32 text-xs p-2 rounded border border-brand-dark/10" />
                        <select value={pmt.method} onChange={(e) => { const n = [...paymentLog]; n[idx].method = e.target.value; setPaymentLog(n); }} className="w-32 text-xs p-2 rounded border border-brand-dark/10 bg-white">
                          <option>Bank Transfer</option><option>Credit Card</option><option>Cash</option><option>UPI</option>
                        </select>
                        <input placeholder="Note/Ref ID" value={pmt.note} onChange={(e) => { const n = [...paymentLog]; n[idx].note = e.target.value; setPaymentLog(n); }} className="flex-1 text-xs p-2 rounded border border-brand-dark/10" />
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-xs font-bold text-green-700/50">₹</span>
                          <input type="number" value={pmt.amount} onChange={(e) => { const n = [...paymentLog]; n[idx].amount = Number(e.target.value); setPaymentLog(n); }} className="w-28 text-xs p-2 pl-6 rounded border border-brand-dark/10 font-bold text-green-700" />
                        </div>
                        <button onClick={() => { const n = [...paymentLog]; n.splice(idx, 1); setPaymentLog(n); }} className="w-8 h-8 rounded bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center text-xs">✕</button>
                      </div>
                    ))}
                    {paymentLog.length === 0 && <p className="text-xs text-brand-dark/40 italic">No payments logged yet.</p>}
                  </div>
                </div>
              </div>

              {/* Right Column: Quotation Builder */}
              <div className="space-y-6">
                <div className="bg-brand-dark text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-xl"></div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-brand-white/80 mb-6">Quotation Calculator</h3>
                  
                  <div className="space-y-4 text-sm font-medium">
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <span className="text-white/60">Base Cost</span>
                      <span>₹{calculateTotals(costItems, markup, tax, paymentLog).baseCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <span className="text-white/60">Agency Markup (%)</span>
                      <input type="number" value={markup} onChange={e => setMarkup(Number(e.target.value))} className="w-20 text-right bg-white/10 border border-white/20 rounded p-1 text-white focus:outline-none" />
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <span className="text-white/60">Tax / GST (%)</span>
                      <input type="number" value={tax} onChange={e => setTax(Number(e.target.value))} className="w-20 text-right bg-white/10 border border-white/20 rounded p-1 text-white focus:outline-none" />
                    </div>
                    
                    <div className="pt-4 flex justify-between items-center text-lg font-bold">
                      <span className="uppercase tracking-widest text-brand-sand">Selling Price</span>
                      <span className="text-brand-white">₹{calculateTotals(costItems, markup, tax, paymentLog).finalPrice.toLocaleString()}</span>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/60 uppercase tracking-widest font-bold">Total Collected</span>
                        <span className="text-green-400 font-bold">₹{calculateTotals(costItems, markup, tax, paymentLog).totalCollected.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/60 uppercase tracking-widest font-bold">Balance Due</span>
                        <span className="text-red-400 font-bold">₹{calculateTotals(costItems, markup, tax, paymentLog).balance.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-brand-dark/10 p-6 shadow-sm">
                   <h3 className="text-sm font-black uppercase tracking-widest text-brand-dark mb-4">Actions</h3>
                   <button onClick={handleSaveLedger} className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-brand-dark transition-colors mb-3">
                     💾 Save Ledger Changes
                   </button>
                   <button onClick={() => generateInvoice(selectedLead)} className="w-full bg-brand-dark/5 text-brand-dark py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-brand-dark/10 transition-colors">
                     📄 Download PDF Invoice
                   </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
