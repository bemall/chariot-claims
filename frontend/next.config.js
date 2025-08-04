/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8020/api',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Chariot Claims',
    NEXT_PUBLIC_USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA || 'true',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
  images: {
    domains: ['localhost'],
  },
  webpack: (config) => {
    // Force Next.js to use the correct TailwindCSS modules
    config.resolve.alias = {
      ...config.resolve.alias,
      tailwindcss: require.resolve('tailwindcss'),
    };
    return config;
  },
};

module.exports = nextConfig;
