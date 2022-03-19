import BeamClient from 'beamio/WebClient';
import * as Schemes from 'beamio-example-schemes';

export default new BeamClient(
  Schemes,
  location.protocol === 'https:'
    ? { host: 'beamio-example-server-1.cloud.usp-3.fr' }
    : {
        host: 'localhost',
        port: 8310,
        ssl: false,
      },
);

export { Schemes };
