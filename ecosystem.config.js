module.exports = {
  apps: [
    {
      name: 'crypto-bros-api',
      script: './packages/api/dist/index.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
