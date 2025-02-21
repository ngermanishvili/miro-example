// Import necessary types for TypeScript support
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure image settings
  images: {
    formats: ["image/avif", "image/webp"],
    domains: [
      "cdn.smartv.cc",
      "image.tmdb.org",
      "static.moviege.com",
      "occ-0-5515-2774.1.nflxso.net",


    ],

  },
};

// Export the configuration
export default nextConfig;
