// @ts-ignore
if (global.IMPORT_MSGS) console.log('<IMPORT: BeamEndpoint.ts>');
/* eslint-disable import/first */

/* eslint-disable no-dupe-class-members */
/* eslint-disable no-unused-vars */
import type { WebSocket } from 'ws';
import type Engine from './engine';
import type { Packet, RequestID } from './engine';
import { DeepObject } from './CompiledScheme';

export default class BeamEndpoint {
  socket: WebSocket;

  private Engine: Engine;

  private callbacks: { [e: RequestID]: Function[] } = {
    disconnect: [],
  };

  constructor(socket: WebSocket, engine: Engine) {
    this.socket = socket;
    this.Engine = engine;

    let pingPayload = String.fromCharCode(Math.floor(Math.random() * 256));
    let pongPayload = '';

    const pingInterval = setInterval(() => {
      if (pingPayload !== pongPayload) {
        this.socket.close(4000, 'TIMEOUT');
        return;
      }

      pingPayload = String.fromCharCode(Math.floor(Math.random() * 256));
      this.socket.send(`\xFF${pingPayload}`);
    }, 5000);

    this.socket.onclose = () => {
      clearInterval(pingInterval);
    };

    this.socket.onmessage = (e) => {
      console.log('Receive socket', e);

      const raw = e.data.toString();

      const packet: Packet = {
        hash: raw[0],
        payload: raw.slice(1),
      };

      if (packet.hash === '\xFF') {
        [, pongPayload] = packet.payload;
        return;
      }

      try {
        const rs = this.Engine.parse(packet);

        const cbs = this.callbacks[rs.id];
        if (!cbs || !cbs.length) return;

        for (const cb of cbs) cb(rs.data);
        // eslint-disable-next-line no-empty
      } catch (error) {}
    };
  }

  /** When the client sends data */
  on(event: string, callback: (data: any) => void): void;

  /** When the client disconnects */
  on(event: 'disconnect', callback: () => void): void;

  on(event: string, callback: Function) {
    if (!this.callbacks[event]) {
      if (!this.Engine.isRegistered(event)) throw new Error(`Invalid event name '${event}'.`);
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  /**
   * Send data to client
   * @param event Request ID
   * @param data Data
   */
  emit(event: string, data: DeepObject): Promise<void> {
    return new Promise((cb, er) => {
      this.socket.send(this.Engine.serialize(event, data), (err) => {
        if (!err) cb(); else er(err);
      });
    });
  }
}
