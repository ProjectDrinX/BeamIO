import { BeamServer } from 'beamio';
import * as Schemes from './main.sch';

const BS = new BeamServer(Schemes, {
  port: 1010,
});

// Events

BS.on('connect', (client) => {
  client.on('loginRequest', (data: typeof Schemes.loginRequest) => {
    console.log('User login request:', data.username, data.password, data.nbr, data.boo);
  });

  client.emit('testRequest', {
    boo: false,
    str: 'testString',
    nbr: 100,
  } as typeof Schemes.testRequest);
});

// Global methods

BS.broadcast('globalMessage', {
  str: 'hello',
  boo: true,
  nbr: 1234,
} as typeof Schemes.testRequest);
