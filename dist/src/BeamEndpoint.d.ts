/// <reference types="node" />
import type { WebSocket } from 'ws';
import type Engine from './engine';
import type { Packet, SchemeID } from './engine';
import type { DeepObject } from './CompiledScheme';
export default class BeamEndpoint {
    socket: WebSocket;
    private Engine;
    protected callbacks: {
        [e: SchemeID]: Function[];
    };
    constructor(engine: Engine, socket: WebSocket);
    get isReady(): boolean;
    handleEvent(event: string, ...args: any[]): void;
    receivePacket(packet: Packet): void;
    /** When the client sends data */
    on(event: string, callback: (data: any) => void): void;
    /** When the client disconnects */
    on(event: 'disconnect', callback: (e: CloseEvent) => void): void;
    /** When the client connects */
    on(event: 'connect', callback: () => void): void;
    /**
     * Send data to client
     * @param event Request ID
     * @param data Data
     */
    emit(event: string, data: DeepObject): Promise<void>;
    close(code?: number, data?: string | Buffer): void;
}
