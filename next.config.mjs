// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.thebillfold.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'png.pngtree.com',
        pathname: '/thumb_back/fw800/background/**',
      },
    ],
  },
};

export default nextConfig;
