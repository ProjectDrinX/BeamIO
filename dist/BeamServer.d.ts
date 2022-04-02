/// <reference types="node" />
import { WebSocketServer } from 'ws';
import type { IncomingMessage } from 'http';
import type { ServerOptions as WSOptions } from 'ws';
import Engine from './engine';
import BeamEndpoint from './BeamEndpoint';
import type { DeepSchemes, EngineConfig } from './engine';
import { DeepObject } from './CompiledScheme';
interface BeamServerConfig {
    /** Server port */
    port?: number;
    /** Socket server options */
    socketServerOptions?: WSOptions;
    /** BeamEngine options */
    engineOptions?: EngineConfig;
}
export default class {
    /** Socket Server instance */
    readonly SocketServer: WebSocketServer;
    /** BeamEngine instance */
    readonly Engine: Engine;
    private callbacks;
    private lastEndpoint;
    private endpoints;
    constructor(Schemes: DeepSchemes, Config?: BeamServerConfig);
    /** When a new client connects */
    on(event: 'connect', callback: (client: BeamEndpoint, req: IncomingMessage) => void): void;
    /**
     * Send data to all clients
     * @param event Request ID
     * @param data Data
     */
    broadcast(event: string, data: DeepObject): Promise<void>;
}
export {};
