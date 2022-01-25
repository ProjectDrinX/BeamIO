module.exports = {
  name: 'LongArray',
  value: ','.repeat(50000).split(',').map((_) => Math.random()),
};
