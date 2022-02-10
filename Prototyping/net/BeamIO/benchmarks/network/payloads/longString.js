module.exports = {
  name: 'LongString',
  value: ','.repeat(6000).replace(/,/g, Math.random()),
};
