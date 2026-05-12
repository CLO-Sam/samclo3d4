import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  compiler: {
    emotion: true,
  },
  async rewrites() {
    return [
      { source: "/notice", destination: "/" },
      { source: "/user-spotlight", destination: "/" },
      { source: "/general", destination: "/" },
      { source: "/challenge", destination: "/" },
      { source: "/project-and-steps", destination: "/" },
      { source: "/tips-and-tricks", destination: "/" },
      { source: "/qna", destination: "/" },
      { source: "/user-feedback", destination: "/" },
      { source: "/job-board", destination: "/" },
      { source: "/community-guide", destination: "/" },
    ];
  },
};

export default nextConfig;
