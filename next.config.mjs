/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Ký tự đại diện cho tất cả hostnames
        pathname: '**', // Ký tự đại diện cho tất cả pathnames
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/order/sale',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
