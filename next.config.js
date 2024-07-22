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
    domains: [
      'xpath-dev.s3.ap-southeast-1.amazonaws.com',
      'xpath-dev.s3.amazonaws.com',
      'storage.googleapis.com',
    ],
  },
}

module.exports = million.next(nextConfig, { auto: true })
