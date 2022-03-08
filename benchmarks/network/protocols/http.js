const http = require('http');

module.exports = {
  name: 'HTTP',
  errors: 0,

  initServer() {
    return new Promise((cb) => {
      this.listeners = [];
      this.server = http.createServer((req, res) => {
        const payName = req.url.replace(/\//g, '');
        if (this.listeners[payName]) this.listeners[payName]();
        res.writeHead(200);
        res.end('OK');
      });

      this.server.listen(3000, () => { cb(); });
    });
  },

  initClient() {},

  test(payload) {
    return new Promise((cb) => {
      this.errors = 0;

      for (let i = 0; i < payload.repeat; i += 1) {
        const req = http.request({
          host: 'localhost',
          port: 3000,
          method: 'POST',
          path: `/${payload.name}`,
        });

        req.on('error', () => {
          this.errors += 1;
          this.listeners[payload.name]();
        });

        req.end(JSON.stringify(payload.value));
      }

      let n = 0;
      this.listeners[payload.name] = () => {
        n += 1;
        if (n === payload.repeat) cb(this.errors);
      };
    });
  },

  end() {
    return new Promise((cb) => {
      this.server.close(() => { cb(); });
    });
  },
};
