/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-class-members */
/* eslint-disable no-redeclare */
import { WebSocketServer } from 'ws';
import type { IncomingMessage } from 'http';
import type { ServerOptions as WSOptions } from 'ws';
import Engine, { Packet } from './engine';
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
export default class BeamServer<Schemes extends DeepSchemes> {
  /** Socket Server instance */
  readonly SocketServer: WebSocketServer;

  /** BeamEngine instance */
  readonly Engine: Engine<Schemes>;

  private callbacks: Record<string, Function[]> = {
    connect: [],
  };

  private lastEndpoint = 0;

  private endpoints: { [k: number]: BeamEndpoint<Schemes> } = {};

  constructor(schemes: Schemes, config: BeamServerConfig = {}) {
    this.Engine = new Engine(schemes, config.engineOptions ?? {});

    const WSConfig = config.socketServerOptions ?? {};
    WSConfig.port = config.port ?? 8310;
    console.log('Creating server', WSConfig);

    this.SocketServer = new WebSocketServer(WSConfig);
    this.SocketServer.on('connection', (socket, req) => {
      const endpoint = new BeamEndpoint<Schemes>(this.Engine, socket);

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

      endpoint.socket.onclose = (CloseEvent) => {
        clearInterval(pingInterval);
        delete this.endpoints[endpointID];
        endpoint.handleEvent('disconnect', CloseEvent);
      };

      this.lastEndpoint += 1;
    });
  }

  /** When a new client connects */
  on(event: 'connect', callback: (client: BeamEndpoint<Schemes>, req: IncomingMessage) => void): void;

  on(event: string, callback: Function) {
    if (!this.callbacks[event]) throw new Error(`Unknown event name: '${event}'`);
    this.callbacks.connect.push(callback);
  }

  /**
   * Send data to all clients
   * @param event Request ID
   * @param data Data
   */
  broadcast<SchemeName extends keyof Schemes>(
    event: SchemeName,
    data: Schemes[SchemeName],
  ): Promise<void> {
    return new Promise((cb, er) => {
      const serialized = this.Engine.serialize(event as string, data);
      for (const endpoint in this.endpoints) {
        if (this.endpoints[endpoint].socket.readyState !== 1) continue;
        this.endpoints[endpoint].socket.send(serialized, (err) => {
          if (!err) cb(); else er(err);
        });
      }
    });
  }
}
