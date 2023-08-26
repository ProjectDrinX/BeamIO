"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = __importDefault(require("./engine"));
const BeamEndpoint_1 = __importDefault(require("./BeamEndpoint"));
class BeamClient extends BeamEndpoint_1.default {
    callbacks = {
        connect: [],
        disconnect: [],
    };
    constructor(schemes, config) {
        // @ts-expect-error WebSocket is not defined in NodeJS
        const WS = (typeof window !== 'undefined') ? WebSocket : global.WebSocket;
        const protocol = (config.ssl === false) ? 'ws' : 'wss';
        const port = config.port ?? (config.ssl === false ? 80 : 443);
        const path = config.path ?? '/';
        if (path[0] !== '/')
            throw new Error('Path must start with \'/\'');
        const hostname = `${protocol}://${config.host}:${port}${path}`;
        console.log('Creating client', hostname, config);
        super(new engine_1.default(schemes, config.engineOptions ?? {}), new WS(hostname, config.socketClientOptions));
        const onConnect = (OpenEvent) => {
            this.socket = OpenEvent.target;
            this.handleEvent('connect');
            this.socket.onmessage = (MessageEvent) => {
                const raw = MessageEvent.data.toString();
                const packet = {
                    hash: raw[0],
                    payload: raw.slice(1),
                };
                if (packet.hash === '\xFF')
                    this.socket.send(raw);
                else
                    this.receivePacket(packet);
            };
            this.socket.onclose = (CloseEvent) => {
                this.handleEvent('disconnect', CloseEvent);
                if (config.autoReconnect === false)
                    return;
                setTimeout(() => {
                    console.log('Auto reconnect...');
                    this.socket = new WS(hostname, config.socketClientOptions);
                    this.socket.onopen = onConnect;
                }, config.reconnectDelay ?? 5000);
            };
        };
        this.socket.onopen = onConnect;
    }
}
exports.default = BeamClient;
