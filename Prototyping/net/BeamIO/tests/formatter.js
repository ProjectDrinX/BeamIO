import { TYPES } from '../lib/src/formatter';
import Formatter from '../lib/src/formatter';

const formatter = new Formatter({
  typeChecking: true,
  strictTyping: true,
});

const STRUCTURE = {
  name: TYPES.String,
  count: TYPES.Number,
  isUser: TYPES.Boolean,
};

const DATA = {
  name: 'Test',
  count: 2,
  isUser: false,
};

console.log('Structure:\n', STRUCTURE);
console.log('Data:\n', DATA);

const formattedData = formatter.format(STRUCTURE, DATA);
console.log('Formatted ->\n', formattedData);

const parsedData = formatter.parse(STRUCTURE, formattedData);
console.log('Parsed ->\n', parsedData);
