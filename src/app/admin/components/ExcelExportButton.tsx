"use client";

import React from "react";
import * as XLSX from "xlsx";

export default function ExcelExportButton({ leads, stats }: { leads: any[]; stats: any }) {
  const handleExport = () => {
    // 1. Create a new workbook
    const wb = XLSX.utils.book_new();

    // 2. Overview Sheet
    const overviewData = [
      ["Metric", "Value"],
      ["Total Page Views", stats.pageviews],
      ["Total Explores", stats.explores],
      ["Total Leads", stats.leads],
      ["Conversion Rate", `${stats.pageviews > 0 ? ((stats.leads / stats.pageviews) * 100).toFixed(1) : 0}%`],
      ["", ""],
      ["Content Type", "Count"],
      ["Destinations", stats.destinations],
      ["Experiences", stats.experiences],
      ["Routes", stats.routes],
      ["Stories", stats.stories],
    ];
    const wsOverview = XLSX.utils.aoa_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(wb, wsOverview, "Overview");

    // 3. Leads Sheet
    const leadsData = leads.map((lead) => ({
      "Date Created": new Date(lead._createdAt).toLocaleDateString(),
      "Customer Name": lead.customerName,
      "Email": lead.email,
      "Phone": lead.phone,
      "Stage": lead.status,
      "Travel Date": lead.travelDate ? new Date(lead.travelDate).toLocaleDateString() : "",
      "Travelers": lead.travelers,
      "Duration (Days)": lead.durationDays,
      "Estimated Budget (INR)": lead.totalPrice || "N/A",
      "Customer Notes": lead.notes || "",
      "Agent Notes": lead.agentNotes || "",
    }));
    
    const wsLeads = XLSX.utils.json_to_sheet(leadsData);
    
    // Auto-size columns for Leads sheet
    const cols = Object.keys(leadsData[0] || {}).map(() => ({ wch: 20 }));
    wsLeads["!cols"] = cols;

    XLSX.utils.book_append_sheet(wb, wsLeads, "Leads Pipeline");

    // 4. Download file
    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `roodhways_crm_export_${dateStr}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-brand-dark text-brand-white text-xs font-bold rounded-lg uppercase tracking-wider hover:bg-brand-blue transition-colors shadow-sm"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
      </svg>
      Download Report (Excel)
    </button>
  );
}
