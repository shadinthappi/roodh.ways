import type { NextConfig } from "next";

// Trigger fresh Vercel build with updated Sanity environment variables
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
