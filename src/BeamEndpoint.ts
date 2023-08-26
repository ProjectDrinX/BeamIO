/* eslint-disable no-dupe-class-members */
/* eslint-disable no-unused-vars */
import type { WebSocket } from 'ws';
import type Engine from './engine';
import type { Packet, SchemeID, DeepSchemes } from './engine';

export default class BeamEndpoint<Schemes extends DeepSchemes> {
  socket: WebSocket;

  private Engine: Engine<Schemes>;

  protected callbacks: { [e: SchemeID]: Function[] } = {
    disconnect: [],
  };

  constructor(engine: Engine<Schemes>, socket: WebSocket) {
    this.Engine = engine;
    this.socket = socket;
  }

  get isReady() {
    return this.socket.readyState === 1;
  }

  handleEvent(event: string, ...args: any[]) {
    for (const f of this.callbacks[event]) f(...args);
  }

  receivePacket(packet: Packet) {
    try {
      const rs = this.Engine.parse(packet);

      const cbs = this.callbacks[rs.id];
      if (!cbs || !cbs.length) return;

      for (const cb of cbs) cb(rs.data);
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }

  /** When the client sends data */
  on<SchemeName extends keyof Schemes>(
    event: SchemeName,
    callback: (data: Schemes[SchemeName]) => void,
  ): void;

  /** When the client disconnects */
  on(event: 'disconnect', callback: (e: CloseEvent) => void): void;

  /** When the client connects */
  on(event: 'connect', callback: () => void): void;

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
  emit<SchemeName extends keyof Schemes>(
    event: SchemeName,
    data: Schemes[SchemeName],
  ): Promise<void> {
    return new Promise((cb, er) => {
      if (!this.socket) {
        er(new Error('No socket'));
        return;
      }
      this.socket.send(this.Engine.serialize(event as string, data), (err) => {
        if (!err) cb(); else er(err);
      });
    });
  }

  close(code?: number, data?: string | Buffer) {
    this.socket.close(code, data);
  }
}
