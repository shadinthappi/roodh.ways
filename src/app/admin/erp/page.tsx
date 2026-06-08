"use client";

import React, { useEffect, useState } from "react";
import CRMVisuals from "../components/CRMVisuals";
import KanbanBoard from "../components/KanbanBoard";
import ExcelExportButton from "../components/ExcelExportButton";
import VendorManager from "../components/VendorManager";
import FinanceManager from "../components/FinanceManager";
import TrashManager from "../components/TrashManager";

export default function ERPOverview() {
  const [activeTab, setActiveTab] = useState<"pipeline" | "finance" | "vendors" | "trash">("pipeline");
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    pageviews: 0,
    explores: 0,
    leads: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch("/api/admin/stats");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats({
            pageviews: statsData.pageviews || 0,
            explores: statsData.explores || 0,
            leads: statsData.leads || 0,
          });
        }

        const leadsRes = await fetch("/api/admin/leads");
        if (leadsRes.ok) {
          const leadsData = await leadsRes.json();
          setLeads(leadsData);
        }

        // Passively trigger CRM cleanup in the background
        fetch("/api/admin/cleanup", { method: "POST" }).catch(() => {});
        
      } catch (err) {
        console.error("Failed to load ERP overview data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-heading font-black uppercase tracking-tight text-brand-dark">
            Travel ERP Dashboard
          </h2>
          <p className="text-brand-dark/85 mt-2 font-sans font-medium">
            Manage your leads pipeline, track financial margins, and manage vendors.
          </p>
        </div>
        {!isLoading && activeTab === "pipeline" && <ExcelExportButton leads={leads} stats={stats} />}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-dark/10 gap-8">
        <button 
          onClick={() => setActiveTab("pipeline")}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === "pipeline" ? "text-brand-blue" : "text-brand-dark/50 hover:text-brand-dark"}`}
        >
          CRM Pipeline
          {activeTab === "pipeline" && <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-blue rounded-t" />}
        </button>
        <button 
          onClick={() => setActiveTab("finance")}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === "finance" ? "text-brand-blue" : "text-brand-dark/50 hover:text-brand-dark"}`}
        >
          Financials & Invoicing
          {activeTab === "finance" && <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-blue rounded-t" />}
        </button>
        <button 
          onClick={() => setActiveTab("vendors")}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === "vendors" ? "text-brand-blue" : "text-brand-dark/50 hover:text-brand-dark"}`}
        >
          Operations & Vendors
          {activeTab === "vendors" && <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-blue rounded-t" />}
        </button>
        <button 
          onClick={() => setActiveTab("trash")}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === "trash" ? "text-red-500" : "text-brand-dark/50 hover:text-red-500"}`}
        >
          Trash (30 Days)
          {activeTab === "trash" && <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500 rounded-t" />}
        </button>
      </div>

      {activeTab === "pipeline" && (
        <div className="space-y-12 animate-[fadeIn_0.3s_ease-out]">
          {/* Traffic & Conversions Dashboard */}
          <div className="bg-brand-white border border-brand-dark/10 rounded-2xl p-8 mb-8 shadow-sm">
            <h3 className="text-lg font-bold uppercase tracking-wider text-brand-dark mb-6 border-b border-brand-dark/10 pb-4">
              Traffic & Lead Conversions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-brand-offwhite p-6 rounded-xl border border-brand-dark/5">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-dark/60 mb-2">Total Page Views</p>
                <p className="font-heading font-black text-4xl text-brand-dark">{stats.pageviews || 0}</p>
              </div>
              <div className="bg-brand-offwhite p-6 rounded-xl border border-brand-dark/5">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-dark/60 mb-2">Total Explores (Clicks)</p>
                <p className="font-heading font-black text-4xl text-brand-dark">{stats.explores || 0}</p>
              </div>
              <div className="bg-brand-offwhite p-6 rounded-xl border border-brand-dark/5">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-blue mb-2">Total Leads</p>
                <p className="font-heading font-black text-4xl text-brand-blue">{stats.leads || 0}</p>
              </div>
              <div className="bg-brand-blue p-6 rounded-xl border border-brand-blue/20 text-brand-white shadow-md">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-white/80 mb-2">Conversion Rate</p>
                <p className="font-heading font-black text-4xl">
                  {stats.pageviews > 0 ? ((stats.leads / stats.pageviews) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Recharts Visualizations */}
          {!isLoading && <CRMVisuals leads={leads} stats={stats as any} />}

          {/* Lead Pipeline Kanban Board */}
          {!isLoading && <KanbanBoard initialLeads={leads} />}
        </div>
      )}

      {activeTab === "finance" && (
        <div className="animate-[fadeIn_0.3s_ease-out]">
          <FinanceManager leads={leads} />
        </div>
      )}

      {activeTab === "vendors" && (
        <div className="animate-[fadeIn_0.3s_ease-out]">
          <VendorManager />
        </div>
      )}

      {activeTab === "trash" && (
        <div className="animate-[fadeIn_0.3s_ease-out]">
          <TrashManager />
        </div>
      )}

    </div>
  );
}
