module.exports = {
  apps: [
    {
      name: 'nextjs-app',
      script: '.next/standalone/server.js',
      args: 'start',
      instances: '1',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
