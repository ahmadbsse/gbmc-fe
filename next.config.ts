/** @type {import('next').NextConfig} */
import dotenv from "dotenv";

dotenv.config();
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [process.env.NEXT_PUBLIC_API_BASE_URL, 'localhost'], // Replace with your server's base URL
  },

};

module.exports = nextConfig;
