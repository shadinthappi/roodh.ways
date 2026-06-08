"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

interface StatItem {
  label: string;
  value: number | string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [stats, setStats] = useState<StatItem[]>([
    { label: "Destinations", value: "..." },
    { label: "Experiences", value: "..." },
    { label: "Routes", value: "..." },
    { label: "Itineraries", value: "..." },
  ]);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/auth/check");
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          if (!isLoginPage) router.push("/admin/login");
        }
      } catch (err) {
        setIsAuthenticated(false);
        if (!isLoginPage) router.push("/admin/login");
      }
    };
    checkAuth();
  }, [pathname, isLoginPage, router]);

  useEffect(() => {
    if (isAuthenticated && !isLoginPage) {
      const fetchStats = async () => {
        try {
          const res = await fetch("/api/admin/stats");
          if (res.ok) {
            const data = await res.json();
            setStats([
              { label: "Destinations", value: data.destinations || 0 },
              { label: "Experiences", value: data.experiences || 0 },
              { label: "Routes", value: data.routes || 0 },
              { label: "Itineraries", value: data.itineraries || 0 },
            ]);
          }
        } catch (err) {
          console.error("Failed to fetch stats", err);
        }
      };
      fetchStats();
    }
  }, [isAuthenticated, isLoginPage]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/auth/logout", { method: "POST" });
      if (res.ok) {
        setIsAuthenticated(false);
        router.push("/admin/login");
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (isAuthenticated === null && !isLoginPage) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-brand-offwhite text-brand-dark">
        <p className="text-sm font-sans font-medium">Loading...</p>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  const menuItems = [
    { label: "Overview", path: "/admin" },
    { label: "Calendar", path: "/admin/calendar" },
    { label: "Bookings", path: "/admin/bookings" },
    { label: "Destinations", path: "/admin/destinations" },
    { label: "Experiences", path: "/admin/experiences" },
    { label: "Routes", path: "/admin/routes" },
    { label: "Itineraries", path: "/admin/itineraries" },
    { label: "International Trips", path: "/admin/internationalTrips" },
    { label: "Products", path: "/admin/products" },
    { label: "Stories", path: "/admin/stories" },
    { label: "Events", path: "/admin/events" },
    { label: "Chatbot", path: "/admin/chatbot" },
    { label: "AI Logs", path: "/admin/ai-logs" },
    { label: "Site Settings", path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen w-full bg-brand-offwhite text-brand-dark flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-brand-dark/10 bg-brand-white flex flex-col shrink-0">
        <div className="p-6 border-b border-brand-dark/10">
          <Link href="/admin" className="flex flex-col gap-1 hover:opacity-80 transition-opacity">
            <span className="font-heading font-black text-xl uppercase tracking-wide text-brand-dark">
              roodh.ways
            </span>
            <span className="text-xs text-brand-dark/75 uppercase tracking-widest font-extrabold">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-6 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-brand-blue/10 text-brand-blue font-bold border-r-4 border-brand-blue"
                    : "text-brand-dark hover:bg-brand-dark/5 hover:text-brand-dark font-semibold border-r-4 border-transparent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-brand-dark/10 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-brand-dark">Administrator</div>
            <div className="text-xs text-brand-dark/75 font-semibold">Signed in</div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="text-xs font-bold uppercase tracking-wider text-brand-blue hover:text-brand-blue/70 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-brand-dark/10 bg-brand-white flex items-center justify-between px-8 shrink-0">
          <h1 className="text-lg font-heading font-bold uppercase tracking-wide text-brand-dark">
            {menuItems.find((item) => item.path === pathname)?.label || "Overview"}
          </h1>
          <Link
            href="/"
            target="_blank"
            className="text-xs font-bold uppercase tracking-wider text-brand-dark/80 hover:text-brand-dark transition-colors"
          >
            View Live Site ↗
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
