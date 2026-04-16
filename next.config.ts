import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  compiler: {
    emotion: true, 
  },
};

export default nextConfig;
