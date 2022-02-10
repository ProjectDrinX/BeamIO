module.exports = {
  name: 'JSON Encode',

  init() {},

  test(payload) {
    return new Promise((cb) => {
      for (let i = 0; i < payload.repeat; i += 1) JSON.stringify(payload.value);
      cb();
    });
  },
};
