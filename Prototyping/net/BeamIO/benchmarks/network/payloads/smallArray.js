module.exports = {
  name: 'SmallArray',
  value: ','.repeat(50).split(',').map(() => Math.random()),
  repeat: 1000,
};
