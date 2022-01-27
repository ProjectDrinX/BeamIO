// Launch tests

try {
  console.log('------ Test "protocol.js" ------');
  require('./tests/protocol');
} catch (error) {
  console.error('============= TEST FAILED =============');
  console.error(` > ${error.message}`);
  console.error('=======================================\n');
  process.exit(1);
}

try {
  console.log('------ Test "formatter.js" -----');
  require('./tests/formatter');
} catch (error) {
  console.error('============= TEST FAILED =============');
  console.error(` > ${error.message}`);
  console.error('=======================================\n');
  process.exit(1);
}

console.log('All tests done !');
