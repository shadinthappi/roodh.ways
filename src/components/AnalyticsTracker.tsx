"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/studio")) return;

    // Determine event type
    let eventType = "pageview";
    if (pathname.startsWith("/plan/") || pathname.startsWith("/destinations/")) {
      eventType = "explore";
    }

    // Ping tracking API
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType, path: pathname }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
