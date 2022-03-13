// @ts-ignore
if (global.IMPORT_MSGS) console.log('<IMPORT: BeamServer.ts>');
/* eslint-disable import/first */

/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-class-members */
/* eslint-disable no-redeclare */
import { WebSocketServer } from 'ws';
import type { IncomingMessage } from 'http';
import type { ServerOptions as WSOptions } from 'ws';
import Engine, { Packet } from './engine';
import BeamEndpoint from './BeamEndpoint';
import type { DeepSchemes, EngineConfig } from './engine';
import { DeepObject } from './CompiledScheme';

interface BeamServerConfig {
  /** Server port */
  port?: number,

  /** Socket server options */
  socketServerOptions?: WSOptions,

  /** BeamEngine options */
  engineOptions?: EngineConfig,
}

export default class {
  /** Socket Server instance */
  readonly SocketServer: WebSocketServer;

  /** BeamEngine instance */
  readonly Engine: Engine;

  private callbacks: { [e: string]: Function[] } = {
    connect: [],
  };

  private lastEndpoint = 0;

  private endpoints: { [k: number]: BeamEndpoint } = {};

  constructor(Schemes: DeepSchemes, Config: BeamServerConfig) {
    this.Engine = new Engine(Schemes, Config.engineOptions ?? {});

    const WSConfig = Config.socketServerOptions || {};
    WSConfig.port = Config.port;
    console.log('Creating server', WSConfig);

    this.SocketServer = new WebSocketServer(WSConfig);
    this.SocketServer.on('connection', (socket, req) => {
      const endpoint = new BeamEndpoint(this.Engine, socket);

      const endpointID = this.lastEndpoint;
      this.endpoints[endpointID] = endpoint;

      for (const f of this.callbacks.connect) f(endpoint, req);

      let pingPayload = String.fromCharCode(Math.floor(Math.random() * 256));
      let pongPayload = '';

      endpoint.socket.send(`\xFF${pingPayload}`);

      endpoint.socket.onmessage = (MessageEvent) => {
        const raw = MessageEvent.data.toString();

        const packet: Packet = {
          hash: raw[0],
          payload: raw.slice(1),
        };

        if (packet.hash === '\xFF') [pongPayload] = packet.payload;
        else endpoint.receivePacket(packet);
      };

      const pingInterval = setInterval(() => {
        if (pingPayload !== pongPayload) {
          endpoint.close(4000, 'TIMEOUT');
          return;
        }

        pingPayload = String.fromCharCode(Math.floor(Math.random() * 256));
        endpoint.socket.send(`\xFF${pingPayload}`);
      }, 5000);

      endpoint.socket.on('close', () => {
        clearInterval(pingInterval);
        delete this.endpoints[endpointID];
      });

      this.lastEndpoint += 1;
    });
  }

  /** When a new client connects */
  on(event: 'connect', callback: (client: BeamEndpoint, req: IncomingMessage) => void): void;

  on(event: string, callback: Function) {
    if (!this.callbacks[event]) throw new Error(`Unknown event name: '${event}'`);
    this.callbacks.connect.push(callback);
  }

  /**
   * Send data to all clients
   * @param event Request ID
   * @param data Data
   */
  broadcast(event: string, data: DeepObject): Promise<void> {
    return new Promise((cb, er) => {
      const serialized = this.Engine.serialize(event, data);
      for (const endpoint in this.endpoints) {
        this.endpoints[endpoint].socket.send(serialized, (err) => {
          if (!err) cb(); else er(err);
        });
      }
    });
  }
}
