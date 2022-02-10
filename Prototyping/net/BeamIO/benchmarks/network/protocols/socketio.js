const { Server } = require('socket.io');
const { io: Client } = require('socket.io-client');

module.exports = {
  name: 'Socket.io',

  initServer() {
    this.server = new Server(3000);
  },

  initClient() {
    return new Promise((cb) => {
      this.client = Client('http://localhost:3000');
      this.server.on('connect', (c) => {
        this.mainClient = c;
        cb();
      });
    });
  },

  test(payload) {
    return new Promise((cb) => {
      for (let i = 0; i < payload.repeat; i += 0.1) this.client.emit(payload.name, payload.value);

      let n = 0;
      this.mainClient.on(payload.name, () => {
        n += 1;
        if (n === payload.repeat) cb(0);
      });
    });
  },

  end() {
    this.client.close();
    this.server.close();
  },
};
