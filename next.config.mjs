// next.config.js
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

const nextConfig = {
  webpack: (config) => {
    config.infrastructureLogging = { level: 'error' };
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[hash][ext][query]'
      }
    });
    return config;
  },
  images: {
    domains: ['res.cloudinary.com'],
    minimumCacheTTL: 31536000,
    deviceSizes: [375, 640, 828, 1080, 1200],
    imageSizes: [16, 32, 64, 96, 128],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  }
};

export default withNextIntl(nextConfig);