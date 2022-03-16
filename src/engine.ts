import Protocol from './protocol';
import type { ProtocolConfig } from './protocol';
import CompiledScheme from './CompiledScheme';
import type { DeepScheme, DeepObject } from './CompiledScheme';

export interface DeepSchemes { [k: string]: DeepScheme }

type SchemeHash = string;
export type SchemeID = string;

interface SchemeHashes { [id: SchemeID]: SchemeHash }
interface DeclaredSchemes { [id: SchemeHash]: CompiledScheme }

interface Response {
  hash: SchemeHash,
  id: SchemeID,
  data: DeepObject,
}

export interface Packet {
  hash: SchemeHash,
  payload: string,
}

export interface EngineConfig {
  protocolConfig?: ProtocolConfig,
}

export default class {
  private schemeHashes: SchemeHashes = {};

  private schemes: DeclaredSchemes = {};

  private protocol: Protocol;

  constructor(Schemes: DeepSchemes, Config: EngineConfig = {}) {
    this.protocol = new Protocol(Config.protocolConfig);

    const SchemeIDs = Object.keys(Schemes).sort((a, b) => a.localeCompare(b));

    let i = 0;
    for (const n in SchemeIDs) {
      const schemeID = SchemeIDs[n];
      if (!Object.prototype.hasOwnProperty.call(Schemes, schemeID)) continue;
      if (i >= 254) throw new Error('Reached scheme number limit');
      const hash: SchemeHash = String.fromCharCode(i);
      const scheme = new CompiledScheme(schemeID, Schemes[schemeID]);

      this.schemeHashes[schemeID] = hash;
      this.schemes[hash] = scheme;

      i += 1;
    }
  }

  isRegistered(schemeID: SchemeID): boolean {
    return this.schemeHashes[schemeID] !== undefined;
  }

  serialize(schemeID: SchemeID, data: DeepObject): string {
    const hash = this.schemeHashes[schemeID];
    if (!hash) throw new Error(`Undeclared scheme '${schemeID}'`);

    const req = this.schemes[hash];
    return `${hash}${this.protocol.encode(req.genIterator(data))}`;
  }

  parse(packet: Packet): Response {
    if (!this.schemes[packet.hash]) throw new Error(`Undeclared scheme $Hash(${packet.hash.charCodeAt(0)})`);
    const req = this.schemes[packet.hash];
    const values = this.protocol.decode(packet);

    return {
      hash: packet.hash,
      id: req.ID,
      data: req.parse(values),
    };
  }
}
