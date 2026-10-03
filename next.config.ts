import type { NextConfig } from 'next';

// Static export for GitHub Pages (served from the custom domain root).
const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
