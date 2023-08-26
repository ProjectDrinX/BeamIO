import Protocol from './tests/protocol.test';
import Encoder from './tests/encoder.test';
import Engine from './tests/engine.test';

// Launch tests

try {
  console.log('------ Test "encoder.test.ts" -----');
  Encoder();
} catch (error) {
  console.error('============= TEST FAILED =============');
  console.error(` > ${error}`);
  console.error(error);
  console.error('=======================================\n');

  process.exit(1);
}

try {
  console.log('------ Test "protocol.test.ts" ------');
  Protocol();
} catch (error) {
  console.error('============= TEST FAILED =============');
  console.error(` > ${error}`);
  console.error(error);
  console.error('=======================================\n');

  process.exit(1);
}

try {
  console.log('------ Test "engine.test.ts" -----');
  Engine();
} catch (error) {
  console.error('============= TEST FAILED =============');
  console.error(` > ${error}`);
  console.error(error);
  console.error('=======================================\n');

  process.exit(1);
}

console.log('All tests done !');
