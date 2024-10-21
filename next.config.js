/** @type {import('next').NextConfig} */

const million = require('million/compiler')

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lodash', 'antd', '@ant-design', 'react-icons', 'babel'],
  swcMinify: true,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  modularizeImports: {
    lodash: {
      transform: 'lodash/{{member}}',
      preventFullImport: true,
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)', // Apply this header to all routes
        headers: [
          {
            key: 'X-FRAME-OPTIONS',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0', // Disable caching
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: 'Fri, 1 Jan 2010 00:00:00 GMT',
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "https://etkdevstajpea1img.blob.core.windows.net/img-store", // 環境変数からURLを取得
          },
        ],
      },
    ]
  },
  // experimental: {
  //   appDir: true,
  //   serverActions: true,
  // },
  // // fix dompurify build https://github.com/vercel/next.js/issues/46893
  webpack: (config) => {
    config.externals = [...config.externals, 'canvas', 'jsdom']
    return config
  },
  images: {
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
}

module.exports = million.next(nextConfig, { auto: true })
