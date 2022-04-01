"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BeamEndpoint {
    socket;
    Engine;
    callbacks = {
        disconnect: [],
    };
    constructor(engine, socket) {
        this.Engine = engine;
        this.socket = socket;
    }
    get isReady() {
        return this.socket.readyState === 1;
    }
    handleEvent(event, ...args) {
        for (const f of this.callbacks[event])
            f(...args);
    }
    receivePacket(packet) {
        try {
            const rs = this.Engine.parse(packet);
            const cbs = this.callbacks[rs.id];
            if (!cbs || !cbs.length)
                return;
            for (const cb of cbs)
                cb(rs.data);
            // eslint-disable-next-line no-empty
        }
        catch (error) { }
    }
    on(event, callback) {
        if (!this.callbacks[event]) {
            if (!this.Engine.isRegistered(event))
                throw new Error(`Invalid event name '${event}'.`);
            this.callbacks[event] = [];
        }
        this.callbacks[event].push(callback);
    }
    /**
     * Send data to client
     * @param event Request ID
     * @param data Data
     */
    emit(event, data) {
        return new Promise((cb, er) => {
            if (!this.socket) {
                er(new Error('No socket'));
                return;
            }
            this.socket.send(this.Engine.serialize(event, data), (err) => {
                if (!err)
                    cb();
                else
                    er(err);
            });
        });
    }
    close(code, data) {
        this.socket.close(code, data);
    }
}
exports.default = BeamEndpoint;
