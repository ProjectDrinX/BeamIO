const { server: WSServer, client: WSClient } = require('websocket');
const http = require('http');

module.exports = {
  name: 'WebSocket 2',

  initServer() {
    return new Promise((cb) => {
      this.listeners = [];

      this.server = new WSServer({
        httpServer: http.createServer((_, res) => {
          res.writeHead(404);
          res.end();
        }).listen(3000, () => { cb(); }),
        autoAcceptConnections: false,
      });

      this.server.on('request', (req) => {
        const sock = req.accept();

        sock.on('message', ({ utf8Data: raw }) => {
          const packet = JSON.parse(raw);
          if (this.listeners[packet[0]]) this.listeners[packet[0]]();
        });
      });
    });
  },

  initClient() {
    return new Promise((cb) => {
      this.client = new WSClient();
      this.client.connect('ws://127.0.0.1:3000');
      this.client.on('connect', (conn) => {
        this.conn = conn;
        cb();
      });
    });
  },

  test(payload) {
    return new Promise((cb) => {
      for (let i = 0; i < payload.repeat; i += 1) {
        this.conn.sendUTF(JSON.stringify([payload.name, payload.value]));
      }

      let n = 0;
      this.listeners[payload.name] = () => {
        n += 1;
        if (n === payload.repeat) cb(0);
      };
    });
  },

  end() {
    this.server.shutDown();
  },
};
