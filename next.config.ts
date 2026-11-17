import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  async redirects() {
    return [
      // The Resources page was renamed to Sources; keep old links working
      { source: "/resources", destination: "/sources", permanent: true },
    ];
  },
};

export default nextConfig;
