/* eslint-disable no-new */
import { Type } from '../main';
import CompiledScheme from './CompiledScheme';

{
  const n = 1000000;
  const d1 = Date.now();
  for (let i = 0; i <= n; i += 1) {
    new CompiledScheme('flat', {
      name: Type.String,
      count: Type.Number,
      isUser: Type.Boolean,
    });
  }
  const d2 = Date.now();
  console.log('Time for compile flat scheme:', (d2 - d1) / n, 'ms');
}

{
  const n = 1000000;
  const d1 = Date.now();
  for (let i = 0; i <= n; i += 1) {
    new CompiledScheme('deep', {
      name: Type.String,
      count: Type.Number,
      isUser: Type.Boolean,
      obj: {
        name: Type.String,
        count: Type.Number,
        isUser: Type.Boolean,
        obj: {
          name: Type.String,
          count: Type.Number,
          isUser: Type.Boolean,
        },
      },
    });
  }
  const d2 = Date.now();
  console.log('Time for compile deep scheme:', (d2 - d1) / n, 'ms');
}
