/// <reference types="node" />
import { WebSocketServer } from 'ws';
import type { IncomingMessage } from 'http';
import type { ServerOptions as WSOptions } from 'ws';
import Engine from './engine';
import BeamEndpoint from './BeamEndpoint';
import type { DeepSchemes, EngineConfig } from './engine';
interface BeamServerConfig {
    /** Server port */
    port?: number;
    /** Socket server options */
    socketServerOptions?: WSOptions;
    /** BeamEngine options */
    engineOptions?: EngineConfig;
}
export default class BeamServer<Schemes extends DeepSchemes> {
    /** Socket Server instance */
    readonly SocketServer: WebSocketServer;
    /** BeamEngine instance */
    readonly Engine: Engine<Schemes>;
    private callbacks;
    private lastEndpoint;
    private endpoints;
    constructor(schemes: Schemes, config?: BeamServerConfig);
    /** When a new client connects */
    on(event: 'connect', callback: (client: BeamEndpoint<Schemes>, req: IncomingMessage) => void): void;
    /**
     * Send data to all clients
     * @param event Request ID
     * @param data Data
     */
    broadcast<SchemeName extends keyof Schemes>(event: SchemeName, data: Schemes[SchemeName]): Promise<void>;
}
export {};
