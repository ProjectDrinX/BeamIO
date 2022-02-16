import { BeamServer, Type } from 'beamio';

const BS = new BeamServer({ // Default values:
  /** Server port */
  port: 1010,
  /**
   * `true`: Throws an error when a request is already registred with this name
   *
   * `false`: Ignore registration
   **/
  strictRegister: true,
});

console.log('BeamServer', BS);

// Declaring all the requests

interface LoginRequestPacket { str: String, nbr: Number, boo: Boolean };

BS.register('loginRequest', {
  str: Type.String,
  nbr: Type.Number,
  boo: Type.Boolean,
});

// Events

BS.on('connect', (user) => {
  user.on('loginRequest', (data: LoginRequestPacket) => {
    console.log('User login request:', data.str, data.nbr, data.boo);
  });
});
