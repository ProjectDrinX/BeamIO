/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-class-members */
/* eslint-disable no-redeclare */
import { WebSocketServer } from 'ws';
import type { ServerOptions as WSOptions } from 'ws';
import Engine from './engine';
import BeamEndpoint from './BeamEndpoint';
import type { DeepSchemes, EngineConfig } from './engine';

interface BeamServerConfig {
  /** Server port */
  port?: number,

  /** Socket server options */
  socketServerOptions?: WSOptions,

  /** BeamEngine options */
  engineOptions?: EngineConfig,
}

interface BeamClient {
  sessionID: string,
  clientID: string,
  endpoint: BeamEndpoint,
}

export class BeamServer {
  private config = {
    port: 1010,
    socketServerOptions: {},
  };

  private WSServer: WebSocketServer;

  private engine: Engine;

  /** Socket Server instance */
  get SocketServer() {
    return this.WSServer;
  }

  private callbacks: { [e: string]: Function[] } = {
    connect: [],
  };

  constructor(Schemes: DeepSchemes, Config: BeamServerConfig) {
    this.engine = new Engine(Schemes, Config.engineOptions ?? {});

    if (Config.port) this.config.port = Config.port;
    if (Config.socketServerOptions) this.config.socketServerOptions = Config.socketServerOptions;
    console.log('Creating server', Config);

    this.WSServer = new WebSocketServer(this.config.socketServerOptions);

    this.WSServer.on('connection', (socket, req) => {
      const endpoint = new BeamEndpoint(socket, this.engine);
      console.log(endpoint);
    });
  }

  /** When a new client connects */
  on(event: 'connect', callback: (client: BeamClient) => void): void;

  on(event: string, callback: Function) {
    if (!this.callbacks[event]) throw new Error(`Unknown event name: '${event}'`);
    this.callbacks.connect.push(callback);
  }
}

export default BeamServer;
