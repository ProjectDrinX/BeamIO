import { BeamServer } from 'beamio';
import * as Schemes from './main.sch';

const BS = new BeamServer(Schemes, {
  port: 1010,
});

// Events

BS.on('connect', (user) => {
  // user.on('loginRequest', (data: typeof Schemes.loginRequest) => {
  //   console.log('User login request:', data.username, data.password, data.nbr, data.boo);

  //   user.emit('testRequest', {
  //     boo: true,
  //     str: 'testString',
  //     nbr: 100,
  //   } as typeof Schemes.testRequest);
  // });
});

// Global methods

// BS.broadcast('globalMessage', );
