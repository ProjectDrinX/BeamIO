module.exports = {
  apps: [
    {
      name: 'beamio-server-example',
      script: 'ts-node main.ts',
      instances: 1,
      autorestart: true,
      watch: '.',
      max_memory_restart: '1G',
    },
  ],
  deploy: {
    production: {
      host: process.env.DEPLOY_SERVER_HOST,
      port: process.env.DEPLOY_SERVER_PORT,
      user: process.env.DEPLOY_SERVER_USER,
      key: 'deploy.key',
      ref: 'origin/main',
      repo: 'git@github.com:ProjectDrinX/BeamIO.git',
      path: `${process.env.DEPLOY_SERVER_PATH}/BeamIO-example`,
      'post-deploy':
        'yarn && cd examples/BeamSchemes && yarn && cd ../server && yarn && pm2 reload ecosystem.config.js --env production && pm2 save && git checkout yarn.lock',
    },
  },
}
