import type { Metadata } from "next";
import { League_Spartan, Oswald } from "next/font/google";
import "./globals.css";

const spartan = League_Spartan({
  variable: "--font-spartan",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

import AnalyticsTracker from "@/components/AnalyticsTracker";
import FloatingLogo from "@/components/FloatingLogo";

export const metadata: Metadata = {
  title: "roodh.ways - India The Majestic",
  description: "Explore the incredible beauty, culture, and adventure of India with roodh.ways.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spartan.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-brand-white text-brand-dark">
        <AnalyticsTracker />
        <FloatingLogo />
        {children}
      </body>
    </html>
  );
}
