import type { NextConfig } from "next";

// Static export: `next build` writes plain HTML/CSS/JS to ./out. Cloudflare Pages serves ./out and
// runs the serverless API in ./functions next to it (admin auth + content publishing).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
