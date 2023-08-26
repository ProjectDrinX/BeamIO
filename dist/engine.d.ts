import type { ProtocolConfig } from './protocol';
import type { DeepScheme, DeepObject } from './CompiledScheme';
export interface DeepSchemes {
    [k: string]: DeepScheme;
}
declare type SchemeHash = string;
export declare type SchemeID = string;
interface Response {
    hash: SchemeHash;
    id: SchemeID;
    data: DeepObject;
}
export interface Packet {
    hash: SchemeHash;
    payload: string;
}
export interface EngineConfig {
    protocolConfig?: ProtocolConfig;
}
export default class BeamEngine<Schemes extends DeepSchemes> {
    private schemeHashes;
    private schemes;
    private protocol;
    constructor(schemes: Schemes, config?: EngineConfig);
    isRegistered(schemeID: SchemeID): boolean;
    serialize(schemeID: SchemeID, data: DeepObject): string;
    parse(packet: Packet): Response;
}
export {};
