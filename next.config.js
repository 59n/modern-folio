/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    turbo: {
      root: process.cwd(),
    },
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig

