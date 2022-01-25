module.exports = {
  name: 'SmallArray',
  value: ','.repeat(50).split(',').map((_) => Math.random()),
  repeat: 1000,
};
