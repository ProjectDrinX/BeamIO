module.exports = {
  name: 'SmallObject',
  value: (() => {
    const obj = {};
    for (let i = 0; i < 10; i += 1) {
      const ind = ','.replace(/,/g, Math.random().toString(36).replace(/0\./, ''));
      const val = ','.repeat(10).replace(/,/g, Math.random().toString(36).replace(/0\./, ''));
      obj[ind] = val;
    }
    return obj;
  })(),
  repeat: 1000,
};
