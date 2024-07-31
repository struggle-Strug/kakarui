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
