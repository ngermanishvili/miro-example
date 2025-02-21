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

    ],

  },
};

// Export the configuration
export default nextConfig;
