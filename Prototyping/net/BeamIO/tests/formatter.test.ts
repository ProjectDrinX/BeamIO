import Formatter, { Type } from '../src/formatter';

const STRUCTURE = {
  name: Type.String,
  count: Type.Number,
  isUser: Type.Boolean,
};

const DATA = {
  name: 'Test',
  count: 2,
  isUser: false,
};

export default () => {
  const formatter = new Formatter({
    typeChecking: true,
    strictTyping: true,
  });

  console.log('Structure:\n', STRUCTURE);
  console.log('Data:\n', DATA);

  const formattedData = formatter.format(STRUCTURE, DATA);
  console.log('Formatted ->\n', formattedData);

  const parsedData = formatter.parse(STRUCTURE, formattedData);
  console.log('Parsed ->\n', parsedData);
};
