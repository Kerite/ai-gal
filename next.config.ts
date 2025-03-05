import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.imgur.com"
      },
      {
        protocol: "https",
        hostname: "ai-gal.s3.ap-southeast-1.amazonaws.com"
      },
      {
        protocol: "https",
        hostname: "*"
      }
    ]
  }
};

export default withNextVideo(nextConfig);