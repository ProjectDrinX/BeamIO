// @ts-ignore
global.IMPORT_MSGS = true;
/* eslint-disable import/first */
import BeamServer from 'beamio/server';
import * as Schemes from './main.sch';

const BS = new BeamServer(Schemes, {
  port: 1010,
});

// Events

BS.on('connect', (client) => {
  console.log('User connected !');

  client.on('loginRequest', (data: typeof Schemes.loginRequest) => {
    console.log('User login request:', data.username, data.password, data.nbr, data.boo);
  });

  client.emit('testRequest', {
    boo: false,
    str: 'testString',
    nbr: 100,
  } as typeof Schemes.testRequest);

  client.on('disconnect', (e) => {
    console.log(`User disconnected: '${e.reason}' (${e.code})`);
  });
});

// Global methods

BS.broadcast('globalMessage', {
  str: 'hello',
  boo: true,
  nbr: 1234,
} as typeof Schemes.globalMessage);
