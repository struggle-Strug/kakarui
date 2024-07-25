module.exports = {
  apps: [
    {
      name: 'nextjs-app',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: '1',
      // exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}