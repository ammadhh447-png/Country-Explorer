import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "mainfacts.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/travel", destination: "/countries", permanent: true },
      { source: "/news", destination: "/time", permanent: true },
      { source: "/timezone", destination: "/time", permanent: true },
      { source: "/unesco", destination: "/rankings", permanent: true },
    ];
  },
};

export default nextConfig;
