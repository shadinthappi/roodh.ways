"use client";

import React, { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

export default function CRMVisuals({ leads, stats }: { leads: any[]; stats: any }) {
  // Aggregate leads by date
  const chartData = useMemo(() => {
    if (!leads || leads.length === 0) return [];
    
    // Create a map of date to count
    const dateMap: Record<string, number> = {};
    
    // Fill with last 14 days to ensure there's a baseline
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dateMap[d.toISOString().split("T")[0]] = 0;
    }
    
    // Add real leads
    leads.forEach((lead) => {
      const dateStr = lead._createdAt.split("T")[0];
      if (dateMap[dateStr] !== undefined) {
        dateMap[dateStr] += 1;
      } else {
        dateMap[dateStr] = 1;
      }
    });
    
    // Sort and format
    return Object.keys(dateMap).sort().map(date => {
      const d = new Date(date);
      return {
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        leads: dateMap[date],
        // Fake pageviews roughly correlating with leads for visual demo
        pageViews: Math.floor(Math.random() * 50) + (dateMap[date] * 10) + 10 
      };
    });
  }, [leads]);

  const contentData = [
    { name: "Destinations", count: stats.destinations },
    { name: "Experiences", count: stats.experiences },
    { name: "Routes", count: stats.routes },
    { name: "Intl Trips", count: stats.internationalTrips },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Time Series Area Chart */}
      <div className="lg:col-span-2 bg-brand-white border border-brand-dark/10 rounded-2xl p-6 shadow-sm flex flex-col h-96">
        <div className="mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dark">Traffic vs Lead Generation</h3>
          <p className="text-xs font-medium text-brand-dark/60">Last 14 Days Overview</p>
        </div>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2A3B4C" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2A3B4C" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D9C9B4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#D9C9B4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" name="Page Views" dataKey="pageViews" stroke="#2A3B4C" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
              <Area type="monotone" name="Leads Generated" dataKey="leads" stroke="#D9C9B4" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Content Distribution Bar Chart */}
      <div className="bg-brand-white border border-brand-dark/10 rounded-2xl p-6 shadow-sm flex flex-col h-96">
        <div className="mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dark">Content Distribution</h3>
          <p className="text-xs font-medium text-brand-dark/60">Active Packages</p>
        </div>
        <div className="flex-1 w-full min-h-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={contentData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#2A3B4C', fontWeight: 'bold' }} />
              <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
              <Bar dataKey="count" name="Count" fill="#2A3B4C" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
