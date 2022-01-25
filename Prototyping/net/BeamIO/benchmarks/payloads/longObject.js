module.exports = {
  name: 'LongObject',
  value: (() => {
    const obj = {};
    for (let i = 0; i < 3000; i += 1) {
      const ind = ','.replace(/,/g, Math.random().toString(36).replace(/0\./, ''));
      const val = ','.repeat(10).replace(/,/g, Math.random().toString(36).replace(/0\./, ''));
      obj[ind] = val;
    }
    return obj;
  })(),
};
