"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import CRMVisuals from "./components/CRMVisuals";
import KanbanBoard from "./components/KanbanBoard";
import TaskManager from "./components/TaskManager";
import ExcelExportButton from "./components/ExcelExportButton";
import VendorManager from "./components/VendorManager";
import FinanceManager from "./components/FinanceManager";
import TrashManager from "./components/TrashManager";

interface RecentDoc {
  _id: string;
  _type: string;
  _updatedAt: string;
  title?: string;
  name?: string;
  slug?: { current: string } | string;
}

export default function AdminOverview() {
  const [activeTab, setActiveTab] = useState<"pipeline" | "finance" | "vendors" | "trash">("pipeline");
  const [recentDocs, setRecentDocs] = useState<RecentDoc[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    destinations: 0,
    experiences: 0,
    routes: 0,
    itineraries: 0,
    stories: 0,
    events: 0,
    internationalTrips: 0,
    products: 0,
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
          setStats(statsData);
        }

        const docsRes = await fetch("/api/admin/recent");
        if (docsRes.ok) {
          const docsData = await docsRes.json();
          setRecentDocs(docsData);
        }

        const leadsRes = await fetch("/api/admin/leads");
        if (leadsRes.ok) {
          const leadsData = await leadsRes.json();
          setLeads(leadsData);
        }

        const tasksRes = await fetch("/api/admin/tasks");
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData);
        }

        // Passively trigger CRM cleanup in the background
        fetch("/api/admin/cleanup", { method: "POST" }).catch(() => {});
        
      } catch (err) {
        console.error("Failed to load dashboard overview data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDocTitle = (doc: RecentDoc) => {
    return doc.title || doc.name || "Untitled Document";
  };

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
      {!isLoading && <CRMVisuals leads={leads} stats={stats} />}

      {/* Lead Pipeline Kanban Board */}
      {!isLoading && <KanbanBoard initialLeads={leads} />}

      {/* Grid of stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: "Destinations", count: stats.destinations, path: "/admin/destinations" },
          { label: "Experiences", count: stats.experiences, path: "/admin/experiences" },
          { label: "Routes", count: stats.routes, path: "/admin/routes" },
          { label: "Itineraries", count: stats.itineraries, path: "/admin/itineraries" },
          { label: "Intl Trips", count: stats.internationalTrips, path: "/admin/internationalTrips" },
          { label: "Products", count: stats.products, path: "/admin/products" },
          { label: "Stories", count: stats.stories, path: "/admin/stories" },
          { label: "Events", count: stats.events, path: "/admin/events" },
        ].map((c) => (
          <Link
            key={c.label}
            href={c.path}
            className="p-6 rounded-2xl bg-brand-white border border-brand-dark/10 hover:border-brand-blue hover:shadow-md transition-all flex flex-col justify-between h-32"
          >
            <div className="text-3xl font-bold text-brand-dark">{c.count}</div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-brand-dark/80">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions & Task Manager */}
        <div className="space-y-6 flex flex-col h-full">
          <div className="bg-brand-white border border-brand-dark/10 rounded-2xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dark mb-4">Quick Creation</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "New Destination", type: "destination" },
                { label: "New Experience", type: "experience" },
                { label: "New Route", type: "route" },
                { label: "New Itinerary", type: "itinerary" },
                { label: "New Intl Trip", type: "internationalTrip" },
                { label: "New Product", type: "product" },
                { label: "New Story", type: "story" },
                { label: "New Event", type: "event" },
              ].map((act) => (
                <Link
                  key={act.label}
                  href={`/admin/${act.type}s/new`}
                  className="block w-full p-3 rounded-lg bg-brand-offwhite hover:bg-brand-blue/10 hover:text-brand-blue text-[10px] font-bold uppercase tracking-wider text-brand-dark transition-colors text-center"
                >
                  + {act.label.replace("New ", "")}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex-1 min-h-[300px]">
             {!isLoading && <TaskManager initialTasks={tasks} />}
          </div>
        </div>

        {/* Recent Updates */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-brand-white border border-brand-dark/10 rounded-2xl p-6 min-h-[400px] flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dark mb-6">Recent Updates</h3>

            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-brand-dark/85">
                <p className="text-sm font-medium">Loading recent documents...</p>
              </div>
            ) : recentDocs.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-brand-dark/85 p-8">
                <p className="text-sm font-medium">No recent documents found.</p>
                <Link
                  href="/admin/destinations/new"
                  className="mt-4 px-6 py-2 rounded-full bg-brand-blue text-white text-sm font-bold uppercase tracking-wider hover:bg-brand-blue/90 transition-colors"
                >
                  Create Document
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recentDocs.map((doc) => {
                  const title = getDocTitle(doc);
                  const type = doc._type;
                  const updatedAtStr = new Date(doc._updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                  return (
                    <div
                      key={doc._id}
                      className="flex items-center justify-between p-4 rounded-xl border border-brand-dark/5 bg-brand-offwhite/50 hover:bg-brand-offwhite transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] px-2 py-1 rounded bg-brand-dark/15 font-extrabold uppercase tracking-wider text-brand-dark w-24 text-center">
                          {type}
                        </span>
                        <span className="text-sm font-extrabold text-brand-dark">
                          {title}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-brand-dark/75 font-semibold">
                          {updatedAtStr}
                        </span>
                        <Link
                          href={`/admin/${type}s/${doc._id}`}
                          className="text-xs font-bold uppercase tracking-wider text-brand-blue hover:underline"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
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
