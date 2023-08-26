import type {
  WebSocket as WSType,
  ClientOptions as WSOptions,
  Event as WSEvent,
} from 'ws';

import type {
  DeepSchemes,
  EngineConfig,
  Packet,
  SchemeID,
} from './engine';

import Engine from './engine';
import BeamEndpoint from './BeamEndpoint';

interface BeamClientConfig {
  /** Server hostname */
  host: string,

  /** Server port */
  port?: number,

  /** SSL Mode (default: true) */
  ssl?: boolean,

  /** Hostname path (Example: '/server1') */
  path?: string,

  /** Auto reconnects socket (default: true) */
  autoReconnect?: boolean,

  /** Auto reconnect delay (default: 5000) */
  reconnectDelay?: number,

  /** Socket server options */
  socketClientOptions?: WSOptions,

  /** BeamEngine options */
  engineOptions?: EngineConfig,
}

export default class BeamClient<Schemes extends DeepSchemes> extends BeamEndpoint<Schemes> {
  protected override callbacks: { [e: SchemeID]: Function[] } = {
    connect: [],
    disconnect: [],
  };

  constructor(schemes: Schemes, config: BeamClientConfig) {
    // @ts-expect-error WebSocket is not defined in NodeJS
    const WS: typeof WSType = (typeof window !== 'undefined') ? WebSocket : global.WebSocket;

    const protocol = (config.ssl === false) ? 'ws' : 'wss';
    const port = config.port ?? (config.ssl === false ? 80 : 443);
    const path = config.path ?? '/';

    if (path[0] !== '/') throw new Error('Path must start with \'/\'');

    const hostname = `${protocol}://${config.host}:${port}${path}`;
    console.log('Creating client', hostname, config);

    super(
      new Engine(schemes, config.engineOptions ?? {}),
      new WS(hostname, config.socketClientOptions),
    );

    const onConnect = (OpenEvent: WSEvent) => {
      this.socket = OpenEvent.target;

      this.handleEvent('connect');

      this.socket.onmessage = (MessageEvent) => {
        const raw = MessageEvent.data.toString();

        const packet: Packet = {
          hash: raw[0],
          payload: raw.slice(1),
        };

        if (packet.hash === '\xFF') this.socket.send(raw);
        else this.receivePacket(packet);
      };

      this.socket.onclose = (CloseEvent) => {
        this.handleEvent('disconnect', CloseEvent);

        if (config.autoReconnect === false) return;

        setTimeout(() => {
          console.log('Auto reconnect...');
          this.socket = new WS(hostname, config.socketClientOptions);
          this.socket.onopen = onConnect;
        }, config.reconnectDelay ?? 5000);
      };
    };

    this.socket.onopen = onConnect;
  }
}
