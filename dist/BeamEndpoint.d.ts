/// <reference types="node" />
import type { WebSocket } from 'ws';
import type Engine from './engine';
import type { Packet, SchemeID, DeepSchemes } from './engine';
export default class BeamEndpoint<Schemes extends DeepSchemes> {
    socket: WebSocket;
    private Engine;
    protected callbacks: {
        [e: SchemeID]: Function[];
    };
    constructor(engine: Engine<Schemes>, socket: WebSocket);
    get isReady(): boolean;
    handleEvent(event: string, ...args: any[]): void;
    receivePacket(packet: Packet): void;
    /** When the client sends data */
    on<SchemeName extends keyof Schemes>(event: SchemeName, callback: (data: Schemes[SchemeName]) => void): void;
    /** When the client disconnects */
    on(event: 'disconnect', callback: (e: CloseEvent) => void): void;
    /** When the client connects */
    on(event: 'connect', callback: () => void): void;
    /**
     * Send data to client
     * @param event Request ID
     * @param data Data
     */
    emit<SchemeName extends keyof Schemes>(event: SchemeName, data: Schemes[SchemeName]): Promise<void>;
    close(code?: number, data?: string | Buffer): void;
}
