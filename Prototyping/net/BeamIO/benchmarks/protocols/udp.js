const udp = require('dgram');

module.exports = {
  name: 'UDP',

  initServer() {
    return new Promise((cb) => {
      this.listeners = [];
      this.server = udp.createSocket('udp4');

      let stack = '';
      this.server.on('message', (msg) => {
        stack += msg;

        let spi = stack.indexOf('\0');
        while (spi !== -1) {
          const packet = stack.slice(0, spi);
          if (packet) {
            try {
              const parsed = JSON.parse(packet);
              if (this.listeners[parsed[0]]) this.listeners[parsed[0]]();
            } catch (_) {
              this.listeners.$ERROR();
            }
          }
          stack = stack.slice(spi + 1);
          spi = stack.indexOf('\0');
        }
      });

      this.server.bind(3000, () => { cb(); });
    });
  },

  initClient() {
    this.client = udp.createSocket('udp4');
  },

  test(payload) {
    return new Promise((cb) => {
      let errors = 0;

      for (let i = 0; i < payload.repeat; i += 1) {
        let data = JSON.stringify([payload.name, payload.value]) + '\0';

        while (data.length) {
          const chunk = data.slice(0, 65507);
          this.client.send(chunk, 3000, 'localhost', (e) => { if (e) errors += 1; });
          data = data.slice(65507);

          setTimeout(() => {
            this.client.send('\0', 3000, 'localhost', (e) => { if (e) errors += 1; });
          }, 1000);
        }
      }

      let n = 0;
      this.listeners[payload.name] = () => {
        n += 1;
        if (n === payload.repeat) cb(errors);
        setTimeout(() => { cb(payload.repeat); }, 1000);
      };

      this.listeners.$ERROR = () => {
        errors += 1;
        this.listeners[payload.name]();
      };
    });
  },

  end() {
    return new Promise((cb) => {
      this.server.close(() => { cb(); });
    });
  },
};
