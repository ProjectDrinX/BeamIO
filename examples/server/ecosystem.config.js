module.exports = {
  apps: [
    {
      name: 'beamio-server-example',
      script: 'yarn test',
      instances: 1,
      autorestart: true,
      watch: '.',
      max_memory_restart: '1G',
      env: {
        PORT: process.env.PORT,
      },
    },
  ],
  deploy: {
    production: {
      host: process.env.DEPLOY_SERVER_HOST,
      user: process.env.DEPLOY_SERVER_USER,
      key: 'deploy.key',
      ref: 'origin/main',
      repo: 'git@github.com:ProjectDrinX/BeamIO.git',
      path: `${process.env.DEPLOY_SERVER_PATH}/BeamIO-example`,
      'post-deploy':
        'cd examples/server && yarn && pm2 reload ecosystem.config.js --env production && pm2 save && git checkout yarn.lock',
      env: {
        PORT: process.env.SERVER_EXAMPLE_PORT
      },
    },
  },
}