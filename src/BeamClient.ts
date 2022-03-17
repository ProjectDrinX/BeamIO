import type { WebSocket as WSType } from 'ws';
import type {
  ClientOptions as WSOptions,
  Event as WSEvent,
} from 'ws';
import Engine, {
  DeepSchemes,
  EngineConfig,
  Packet,
  SchemeID,
} from './engine';
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

export default class extends BeamEndpoint {
  protected override callbacks: { [e: SchemeID]: Function[] } = {
    connect: [],
    disconnect: [],
  };

  constructor(Schemes: DeepSchemes, Config: BeamClientConfig) {
    // @ts-ignore
    const WS: typeof WSType = (typeof window !== 'undefined') ? WebSocket : global.WebSocket;

    const protocol = (Config.ssl === false) ? 'ws' : 'wss';
    const port = Config.port ?? (Config.ssl ? 443 : 80);
    const path = Config.path ?? '/';

    if (path[0] !== '/') throw new Error('Path must start with \'/\'');

    const hostname = `${protocol}://${Config.host}:${port}${path}`;
    console.log('Creating client', hostname, Config);

    super(
      new Engine(Schemes, Config.engineOptions ?? {}),
      new WS(hostname, Config.socketClientOptions),
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

        if (Config.autoReconnect === false) return;

        setTimeout(() => {
          console.log('Auto reconnect...');
          this.socket = new WS(hostname, Config.socketClientOptions);
          this.socket.onopen = onConnect;
        }, Config.reconnectDelay ?? 5000);
      };
    };

    this.socket.onopen = onConnect;
  }
}
