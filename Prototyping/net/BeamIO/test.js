// Launch tests

try {
  console.log('------ Test "protocol.ts" ------');
  require('./tests/protocol');
} catch (error) {
  console.error('============= TEST FAILED =============');
  // @ts-ignore
  console.error(` > ${error.message}`);
  console.error('=======================================\n');
  process.exit(1);
}

try {
  console.log('------ Test "formatter.ts" -----');
  require('./tests/formatter');
} catch (error) {
  console.error('============= TEST FAILED =============');
  // @ts-ignore
  console.error(` > ${error.message}`);
  console.error('=======================================\n');
  process.exit(1);
}

console.log('All tests done !');
