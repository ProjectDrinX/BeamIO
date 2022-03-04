import Protocol from './protocol';
import type { ProtocolConfig } from './protocol';
import CompiledScheme from './CompiledScheme';
import type { DeepScheme, DeepObject } from './CompiledScheme';

export interface DeepSchemes { [k: string]: DeepScheme }

export type RequestHash = string;
export type RequestID = string;

export interface RequestHashes { [id: RequestID]: RequestHash }
export interface Requests { [id: RequestHash]: CompiledScheme }

export interface Response {
  hash: RequestHash,
  id: RequestID,
  data: DeepObject,
}

export interface Packet {
  hash: RequestHash,
  payload: string,
}

export interface EngineConfig {
  protocolConfig?: ProtocolConfig,
}

export default class {
  private requestHashes: RequestHashes = {};

  private requests: Requests = {};

  private protocol: Protocol;

  constructor(Schemes: DeepSchemes, Config: EngineConfig = {}) {
    this.protocol = new Protocol(Config.protocolConfig);

    let i = 0;
    for (const reqID in Schemes) {
      if (!Object.prototype.hasOwnProperty.call(Schemes, reqID)) continue;
      if (i >= 254) throw new Error('Reached request number limit');
      const hash: RequestHash = String.fromCharCode(i);
      const scheme = new CompiledScheme(reqID, Schemes[reqID]);

      this.requestHashes[reqID] = hash;
      this.requests[hash] = scheme;

      i += 1;
    }
  }

  isRegistered(reqID: RequestID): boolean {
    return this.requestHashes[reqID] !== undefined;
  }

  serialize(reqID: RequestID, data: DeepObject): string {
    const hash = this.requestHashes[reqID];
    if (!hash) throw new Error(`Undeclared request '${reqID}'`);

    const req = this.requests[hash];
    return `${hash}${this.protocol.encode(req.genIterator(data))}`;
  }

  parse(packet: Packet): Response {
    if (!this.requests[packet.hash]) throw new Error(`Undeclared request $Hash(${packet.hash.charCodeAt(0)})`);
    const req = this.requests[packet.hash];
    const values = this.protocol.decode(packet);

    return {
      hash: packet.hash,
      id: req.ID,
      data: req.parse(values),
    };
  }
}
