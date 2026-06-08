"use client";

import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function FinanceManager({ leads }: { leads: any[] }) {
  const [activeLeads, setActiveLeads] = useState(leads);

  // We filter out cancelled leads for the financial view typically
  const financialLeads = activeLeads.filter(l => l.status !== "Cancelled");

  const generateInvoice = (lead: any) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138); // brand-dark approx
    doc.text("ROODH.WAYS", 14, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Kerala, India", 14, 28);
    doc.text("hello@roodhways.com", 14, 33);
    doc.text("+91 9876543210", 14, 38);

    // INVOICE text
    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(200, 200, 200);
    doc.text("INVOICE", 140, 25);

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text(`Invoice No: RW-${lead._id.substring(0, 6).toUpperCase()}`, 140, 33);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 38);

    // Bill To
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 14, 55);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(lead.customerName || "Valued Customer", 14, 62);
    doc.text(lead.email || "", 14, 67);
    doc.text(lead.phone || "", 14, 72);

    // Trip Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TRIP DETAILS:", 140, 55);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Travel Date: ${lead.travelDate ? new Date(lead.travelDate).toLocaleDateString() : "TBD"}`, 140, 62);
    doc.text(`Travelers: ${lead.travelers} Pax`, 140, 67);

    // Table
    const gross = lead.totalPrice || 0;
    const advance = lead.advancePaid || 0;
    const balance = gross - advance;

    autoTable(doc, {
      startY: 85,
      head: [['Description', 'Amount (INR)']],
      body: [
        [`Custom Travel Package (${lead.travelers} Pax)`, `Rs. ${gross.toLocaleString()}`],
        ['Taxes & Fees', 'Included'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138] }
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount: Rs. ${gross.toLocaleString()}`, 140, finalY);
    
    doc.setTextColor(34, 197, 94); // Green
    doc.text(`Advance Paid: Rs. ${advance.toLocaleString()}`, 140, finalY + 7);
    
    doc.setTextColor(239, 68, 68); // Red
    doc.text(`Balance Due: Rs. ${balance.toLocaleString()}`, 140, finalY + 14);

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Thank you for traveling with Roodh.ways!", 105, 280, { align: "center" });

    doc.save(`Invoice_${lead.customerName.replace(/\s+/g, '_')}.pdf`);
  };

  const handleWhatsApp = (lead: any, type: string) => {
    let msg = "";
    const balance = (lead.totalPrice || 0) - (lead.advancePaid || 0);

    if (type === "invoice") {
      msg = `Hi ${lead.customerName}, your trip with Roodh.ways is confirmed! Your total package cost is ₹${(lead.totalPrice||0).toLocaleString()} and advance paid is ₹${(lead.advancePaid||0).toLocaleString()}. Balance due: ₹${balance.toLocaleString()}. Please let us know if you need the PDF invoice attached.`;
    } else if (type === "payment_reminder") {
      msg = `Hi ${lead.customerName}, this is a gentle reminder from Roodh.ways regarding your upcoming trip. You have a pending balance of ₹${balance.toLocaleString()}. Please arrange payment at your earliest convenience.`;
    }

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encoded}`, '_blank');
  };

  const updateFinancials = async (id: string, advance: number, cost: number, total: number) => {
    try {
      await fetch("/api/admin/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mutations: [{ patch: { id, set: { advancePaid: advance, vendorCosts: cost, totalPrice: total } } }]
        })
      });
      // Update local state
      setActiveLeads(prev => prev.map(l => l._id === id ? { ...l, advancePaid: advance, vendorCosts: cost, totalPrice: total } : l));
    } catch (e) {
      alert("Failed to update financials");
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-white p-6 rounded-2xl border border-brand-dark/10 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-brand-dark/50 mb-1">Expected Revenue</p>
          <p className="text-3xl font-heading font-black text-brand-dark">
            ₹{financialLeads.reduce((acc, l) => acc + (l.totalPrice || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-brand-white p-6 rounded-2xl border border-brand-dark/10 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-brand-dark/50 mb-1">Total Collections</p>
          <p className="text-3xl font-heading font-black text-green-600">
            ₹{financialLeads.reduce((acc, l) => acc + (l.advancePaid || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-brand-white p-6 rounded-2xl border border-brand-dark/10 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-brand-dark/50 mb-1">Pending Balance</p>
          <p className="text-3xl font-heading font-black text-red-500">
            ₹{financialLeads.reduce((acc, l) => acc + ((l.totalPrice || 0) - (l.advancePaid || 0)), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Financials Table */}
      <div className="bg-brand-white border border-brand-dark/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-brand-dark/10">
          <h3 className="text-lg font-bold uppercase tracking-wider text-brand-dark">Booking Financials & Invoices</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-brand-offwhite border-b border-brand-dark/10">
                <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-brand-dark/50">Client & Trip</th>
                <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-brand-dark/50">Total Price (₹)</th>
                <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-brand-dark/50">Advance Paid (₹)</th>
                <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-brand-dark/50">Vendor Cost (₹)</th>
                <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-brand-dark/50">Status</th>
                <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-brand-dark/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {financialLeads.map((lead) => {
                const total = lead.totalPrice || 0;
                const advance = lead.advancePaid || 0;
                const cost = lead.vendorCosts || 0;
                const balance = total - advance;
                const profit = total - cost;
                const isPaid = total > 0 && balance <= 0;

                return (
                  <tr key={lead._id} className="border-b border-brand-dark/5 hover:bg-brand-offwhite/30 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="font-bold text-sm text-brand-dark">{lead.customerName}</div>
                      <div className="text-[10px] text-brand-dark/50 mt-0.5">{lead.travelDate ? new Date(lead.travelDate).toLocaleDateString() : "No Date"} • {lead.travelers} Pax</div>
                    </td>
                    <td className="py-4 px-6">
                      <input 
                        type="number" 
                        defaultValue={total} 
                        onBlur={(e) => updateFinancials(lead._id, advance, cost, Number(e.target.value))}
                        className="w-24 px-2 py-1 bg-white border border-brand-dark/10 rounded text-sm focus:outline-brand-blue"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <input 
                        type="number" 
                        defaultValue={advance} 
                        onBlur={(e) => updateFinancials(lead._id, Number(e.target.value), cost, total)}
                        className="w-24 px-2 py-1 bg-white border border-brand-dark/10 rounded text-sm focus:outline-brand-blue"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <input 
                        type="number" 
                        defaultValue={cost} 
                        onBlur={(e) => updateFinancials(lead._id, advance, Number(e.target.value), total)}
                        className="w-24 px-2 py-1 bg-white border border-brand-dark/10 rounded text-sm focus:outline-brand-blue text-red-600"
                      />
                      {cost > 0 && <div className="text-[10px] text-brand-blue font-bold mt-1">Margin: ₹{profit}</div>}
                    </td>
                    <td className="py-4 px-6">
                      {total === 0 ? (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-[10px] font-bold uppercase">Pending Cost</span>
                      ) : isPaid ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase">Fully Paid</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-[10px] font-bold uppercase">Due: ₹{balance}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button 
                        onClick={() => generateInvoice(lead)}
                        title="Download PDF Invoice"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-dark/5 hover:bg-brand-blue hover:text-white transition-colors"
                      >
                        📄
                      </button>
                      <button 
                        onClick={() => handleWhatsApp(lead, "invoice")}
                        title="Send via WhatsApp"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                      >
                        💬
                      </button>
                      {!isPaid && total > 0 && (
                        <button 
                          onClick={() => handleWhatsApp(lead, "payment_reminder")}
                          title="Send Payment Reminder"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                        >
                          🔔
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
