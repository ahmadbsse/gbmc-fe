/** @type {import('next').NextConfig} */
import dotenv from "dotenv";

dotenv.config();
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.NEXT_PUBLIC_API_BASE_URL,
        port: "",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: process.env.NEXT_PUBLIC_BASE_URL,
        port: "",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
        port: "",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: 'localhost',
      },
    ],
  },

};

module.exports = nextConfig;
