import BeamClient from 'beamio/WebClient';
import * as Schemes from 'beamio-example-schemes';

export default new BeamClient(Schemes, {
  host: 'localhost',
  port: 1010,
  ssl: false,
});

export { Schemes };