"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import TaskManager from "./components/TaskManager";

interface RecentDoc {
  _id: string;
  _type: string;
  _updatedAt: string;
  title?: string;
  name?: string;
  slug?: { current: string } | string;
}

export default function AdminOverview() {
  const [recentDocs, setRecentDocs] = useState<RecentDoc[]>([]);
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

        const tasksRes = await fetch("/api/admin/tasks");
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData);
        }

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
    <div className="space-y-12 animate-[fadeIn_0.3s_ease-out]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-heading font-black uppercase tracking-tight text-brand-dark">
            Admin Dashboard
          </h2>
          <p className="text-brand-dark/85 mt-2 font-sans font-medium">
            Manage your website content, review stats, and handle daily tasks.
          </p>
        </div>
      </div>

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
  );
}
