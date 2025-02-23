/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "**.nflxso.net",
      },
      {
        protocol: "https",
        hostname: "*.com",
      },
      {
        protocol: "https",
        hostname: "*.net",
      },
      {
        protocol: "https",
        hostname: "*.cc",
      }
    ],
    unoptimized: true, // Fallback for unknown domains
  },
};

export default nextConfig;