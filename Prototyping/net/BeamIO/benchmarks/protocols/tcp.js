const net = require('net');

module.exports = {
  name: 'TCP',

  initServer() {
    return new Promise((cb) => {
      this.listeners = [];
      this.server = net.createServer((c) => {
        let stack = '';

        c.on('data', (chunk) => {
          const strChunk = chunk.toString();
          stack += strChunk;

          let spi = stack.indexOf('\0');
          while (spi !== -1) {
            const packet = stack.slice(0, spi);
            if (packet) {
              const parsed = JSON.parse(packet);
              if (this.listeners[parsed[0]]) this.listeners[parsed[0]]();
            }
            stack = stack.slice(spi + 1);
            spi = stack.indexOf('\0');
          }
        });
      })
      .listen(3000, () => { cb(); });
    });
  },

  initClient() {
    return new Promise((cb) => {
      this.client = new net.Socket();
      this.client.connect(3000, '127.0.0.1', () => { cb(); });
    });
  },

  test(payload) {
    return new Promise((cb) => {
      for (let i = 0; i < payload.repeat; i += 1) {
        this.client.write(JSON.stringify([payload.name, payload.value]));
        this.client.write('\0');
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
