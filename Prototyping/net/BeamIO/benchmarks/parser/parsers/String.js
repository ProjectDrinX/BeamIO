module.exports = {
  name: 'BeamIO Encode',

  config: {
    CHAR_MAIN_SEP: '\x30',
    CHAR_ESCAPE: '\x31',
  },

  init() {},

  test(payload) {
    return new Promise((cb) => {
      for (let n = 0; n < payload.repeat; n += 1) {
        const array = payload.value;

        let rs = '';
        // eslint-disable-next-line no-restricted-syntax, guard-for-in
        for (const x in array) {
          const c = array[x];

          let str = `${c}`;
          let i = str.indexOf(this.config.CHAR_ESCAPE);

          while (i !== -1) {
            str = `${str.substring(0, i)}${this.config.CHAR_ESCAPE}${str.substring(i)}`;
            i = str.indexOf(this.config.CHAR_ESCAPE, i + 2);
          }

          i = str.indexOf(this.config.CHAR_MAIN_SEP, i);
          while (i !== -1) {
            str = `${str.substring(0, i)}${this.config.CHAR_ESCAPE}${str.substring(i)}`;
            i = str.indexOf(this.config.CHAR_MAIN_SEP, i + 2);
          }

          rs += str;
          // eslint-disable-next-line no-unused-vars
          if (x !== array.length - 1) rs += this.config.CHAR_MAIN_SEP;
        }
      }
      cb();
    });
  },
};
