const { WebSocket, WebSocketServer } = require('ws');

module.exports = {
  name: 'WebSocket 1',

  initServer() {
    return new Promise((cb) => {
      this.listeners = [];
      this.server = new WebSocketServer({ port: 3000 });

      this.server.on('listening', () => { cb(); });

      this.server.on('connection', (s) => {
        s.on('message', (raw) => {
          const packet = JSON.parse(raw.toString());
          if (this.listeners[packet[0]]) this.listeners[packet[0]]();
        });
      });
    });
  },

  initClient() {
    return new Promise((cb) => {
      this.client = new WebSocket('ws://127.0.0.1:3000');
      this.client.on('open', () => { cb(); });
    });
  },

  test(payload) {
    return new Promise((cb) => {
      for (let i = 0; i < payload.repeat; i += 1) {
        this.client.send(JSON.stringify([payload.name, payload.value]));
      }

      let n = 0;
      this.listeners[payload.name] = () => {
        n += 1;
        if (n === payload.repeat) cb(0);
      };
    });
  },

  end() {
    this.server.close();
  },
};
