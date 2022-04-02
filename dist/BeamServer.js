"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-class-members */
/* eslint-disable no-redeclare */
const ws_1 = require("ws");
const engine_1 = __importDefault(require("./engine"));
const BeamEndpoint_1 = __importDefault(require("./BeamEndpoint"));
class default_1 {
    /** Socket Server instance */
    SocketServer;
    /** BeamEngine instance */
    Engine;
    callbacks = {
        connect: [],
    };
    lastEndpoint = 0;
    endpoints = {};
    constructor(Schemes, Config = {}) {
        this.Engine = new engine_1.default(Schemes, Config.engineOptions ?? {});
        const WSConfig = Config.socketServerOptions ?? {};
        WSConfig.port = Config.port ?? 8310;
        console.log('Creating server', WSConfig);
        this.SocketServer = new ws_1.WebSocketServer(WSConfig);
        this.SocketServer.on('connection', (socket, req) => {
            const endpoint = new BeamEndpoint_1.default(this.Engine, socket);
            const endpointID = this.lastEndpoint;
            this.endpoints[endpointID] = endpoint;
            for (const f of this.callbacks.connect)
                f(endpoint, req);
            let pingPayload = String.fromCharCode(Math.floor(Math.random() * 256));
            let pongPayload = '';
            endpoint.socket.send(`\xFF${pingPayload}`);
            endpoint.socket.onmessage = (MessageEvent) => {
                const raw = MessageEvent.data.toString();
                const packet = {
                    hash: raw[0],
                    payload: raw.slice(1),
                };
                if (packet.hash === '\xFF')
                    [pongPayload] = packet.payload;
                else
                    endpoint.receivePacket(packet);
            };
            const pingInterval = setInterval(() => {
                if (pingPayload !== pongPayload) {
                    endpoint.close(4000, 'TIMEOUT');
                    return;
                }
                pingPayload = String.fromCharCode(Math.floor(Math.random() * 256));
                endpoint.socket.send(`\xFF${pingPayload}`);
            }, 5000);
            endpoint.socket.onclose = (CloseEvent) => {
                clearInterval(pingInterval);
                delete this.endpoints[endpointID];
                endpoint.handleEvent('disconnect', CloseEvent);
            };
            this.lastEndpoint += 1;
        });
    }
    on(event, callback) {
        if (!this.callbacks[event])
            throw new Error(`Unknown event name: '${event}'`);
        this.callbacks.connect.push(callback);
    }
    /**
     * Send data to all clients
     * @param event Request ID
     * @param data Data
     */
    broadcast(event, data) {
        return new Promise((cb, er) => {
            const serialized = this.Engine.serialize(event, data);
            for (const endpoint in this.endpoints) {
                if (this.endpoints[endpoint].socket.readyState !== 1)
                    continue;
                this.endpoints[endpoint].socket.send(serialized, (err) => {
                    if (!err)
                        cb();
                    else
                        er(err);
                });
            }
        });
    }
}
exports.default = default_1;
