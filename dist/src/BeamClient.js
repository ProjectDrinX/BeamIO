"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = __importDefault(require("./engine"));
const BeamEndpoint_1 = __importDefault(require("./BeamEndpoint"));
class default_1 extends BeamEndpoint_1.default {
    callbacks = {
        connect: [],
        disconnect: [],
    };
    constructor(Schemes, Config) {
        // @ts-ignore
        const WS = (typeof window !== 'undefined') ? WebSocket : global.WebSocket;
        const protocol = (Config.ssl === false) ? 'ws' : 'wss';
        const port = Config.port ?? (Config.ssl === false ? 80 : 443);
        const path = Config.path ?? '/';
        if (path[0] !== '/')
            throw new Error('Path must start with \'/\'');
        const hostname = `${protocol}://${Config.host}:${port}${path}`;
        console.log('Creating client', hostname, Config);
        super(new engine_1.default(Schemes, Config.engineOptions ?? {}), new WS(hostname, Config.socketClientOptions));
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
                if (Config.autoReconnect === false)
                    return;
                setTimeout(() => {
                    console.log('Auto reconnect...');
                    this.socket = new WS(hostname, Config.socketClientOptions);
                    this.socket.onopen = onConnect;
                }, Config.reconnectDelay ?? 5000);
            };
        };
        this.socket.onopen = onConnect;
    }
}
exports.default = default_1;
