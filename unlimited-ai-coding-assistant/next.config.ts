import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output to 'out' directory for Electron
  distDir: 'out',
  trailingSlash: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
};

export default nextConfig;
