import type { ClientOptions as WSOptions } from 'ws';
import type { DeepSchemes, EngineConfig, SchemeID } from './engine';
import BeamEndpoint from './BeamEndpoint';
interface BeamClientConfig {
    /** Server hostname */
    host: string;
    /** Server port */
    port?: number;
    /** SSL Mode (default: true) */
    ssl?: boolean;
    /** Hostname path (Example: '/server1') */
    path?: string;
    /** Auto reconnects socket (default: true) */
    autoReconnect?: boolean;
    /** Auto reconnect delay (default: 5000) */
    reconnectDelay?: number;
    /** Socket server options */
    socketClientOptions?: WSOptions;
    /** BeamEngine options */
    engineOptions?: EngineConfig;
}
export default class BeamClient<Schemes extends DeepSchemes> extends BeamEndpoint<Schemes> {
    protected callbacks: {
        [e: SchemeID]: Function[];
    };
    constructor(schemes: Schemes, config: BeamClientConfig);
}
export {};
