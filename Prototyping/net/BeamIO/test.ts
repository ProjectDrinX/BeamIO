import Protocol from './tests/protocol.test';
import Formatter from './tests/formatter.test';
import Encoder from './tests/encoder.test';

// Launch tests

try {
  console.log('------ Test "encoder.test.ts" -----');
  Encoder();
} catch (error) {
  console.error('============= TEST FAILED =============');
  console.error(` > ${error}`);
  console.error(error);
  console.error('=======================================\n');
  // @ts-ignore
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
  // @ts-ignore
  process.exit(1);
}

try {
  console.log('------ Test "formatter.test.ts" -----');
  Formatter();
} catch (error) {
  console.error('============= TEST FAILED =============');
  console.error(` > ${error}`);
  console.error(error);
  console.error('=======================================\n');
  // @ts-ignore
  process.exit(1);
}

console.log('All tests done !');
