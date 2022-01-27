const Formatter = require('../src/formatter');

const formatter = new Formatter({
  typeChecking: true,
  strictTyping: true,
});

const STRUCTURE = {
  name: Formatter.TYPES.String,
  count: Formatter.TYPES.Number,
  isUser: Formatter.TYPES.Boolean,
};

const DATA = {
  name: 'Test',
  count: 2,
  isUser: false,
};

console.log('Structure:\n', STRUCTURE);
console.log('Data:\n', DATA);

const formatted = formatter.format(STRUCTURE, DATA);
console.log('Formatted ->\n', formatted);

const parsed = formatter.parse(STRUCTURE, formatted);
console.log('Parsed ->\n', parsed);
