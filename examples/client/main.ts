// @ts-ignore
global.IMPORT_MSGS = true;
/* eslint-disable import/first */
import BeamClient from 'beamio/client';
import * as Schemes from './main.sch';

const Client = new BeamClient(Schemes, {
  host: 'localhost',
  port: 1010,
  ssl: false,
});

Client.on('connect', () => {
  console.log('Client connected !');

  Client.emit('loginRequest', {
    password: 'PASS',
    username: 'USER',
    boo: false,
    nbr: 10000,
  } as typeof Schemes.loginRequest);
});

Client.on('disconnect', (e) => {
  console.log(`Client disconnected: '${e.reason}' (${e.code})`);
});
