/* eslint-disable no-param-reassign */
module.exports = {
  name: 'Uint8Array Encode',

  config: {
    CHAR_MAIN_SEP_C: 30,
    CHAR_ESCAPE_C: 31,
  },

  init() {},

  concatBuff(a, b) {
    const c = new Uint8Array(a.length + b.length + 1);
    c.set(a, 0);
    c.set([this.config.CHAR_ESCAPE_C], a.length);
    c.set(b, a.length + 1);

    return c;
  },

  /**
   * @param {Uint8Array} buf
   * @returns
   */
  encodeBuff(buf) {
    let i = buf.indexOf(this.config.CHAR_ESCAPE_C);

    while (i !== -1) {
      buf = this.concatBuff(buf.subarray(0, i), buf.subarray(i));
      i = buf.indexOf(this.config.CHAR_ESCAPE_C, i + 2);
    }

    i = buf.indexOf(this.config.CHAR_MAIN_SEP_C, i);
    while (i !== -1) {
      buf = this.concatBuff(buf.subarray(0, i), buf.subarray(i));
      i = buf.indexOf(this.config.CHAR_MAIN_SEP_C, i + 2);
    }

    return buf;
  },

  test(payload) {
    return new Promise((cb) => {
      for (let n = 0; n < payload.repeat; n += 1) {
        const array = payload.value;

        const arrBuff = array.map((s) => new Uint8Array(s.split('').map((c) => c.charCodeAt(0))));
        let rs = null;

        for (const c of arrBuff) {
          if (!rs) rs = this.encodeBuff(c);
          else rs = this.concatBuff(rs, this.encodeBuff(c));
        }
      }

      cb();
    });
  },

  end() {
    return new Promise((cb) => {
      this.server.close(() => { cb(); });
    });
  },
};
