module.exports = {
  name: 'LongArray',
  value: ','.repeat(50000).split(',').map(() => Math.random()),
};
